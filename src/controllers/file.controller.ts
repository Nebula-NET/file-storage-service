import { createFileDTOParams } from './../dto/file.dto';
import { createFileDTOHeaders } from './../dto/file.dto';
import { Folder } from './../entities/folder.entity';
import { User } from './../entities/user.entity';
import { File } from './../entities/file.entity';
import { Storage } from './../entities/storage.entity';
import { FileSecret} from './../entities/fileSecret.entity';
import {Router, Request, Response} from 'express'
import { HandleError } from './../handlesErrors/handleError';
import { FolderService } from './../services/folder.service';
import { UserService } from './../services/user.service';
import { FileService } from './../services/file.service';
import { StorageService } from './../services/storage.service';
import { ipfsService } from './../services/ipfs.service';
import { FileSecretService } from './../services/fileSecret.service';
import { IResponse } from './../interfaces/response.interface';
import * as IPFS from 'ipfs-core'



export class FileController{
    public path: String = "/file-storage/file";
	public router = Router();

    private userServcie:UserService;
    private folderServcie:FolderService;
    private fileServcie:FileService;
    private storageService:StorageService;
    private ipfsService:ipfsService;
    private fileSecretService:FileSecretService;


    constructor(){
        this.initalRoute()
        this.folderServcie = new FolderService()
        this.userServcie = new UserService()
        this.fileServcie = new FileService()
        this.storageService = new StorageService()
        this.ipfsService = new ipfsService()
        this.fileSecretService = new FileSecretService()
    }


    private initalRoute(){
        this.router.post('/create/:parent_id/:name-:size', (req, res) => this.creatFile(req, res))
        this.router.get('/folder/:parent_id', (req, res) => this.getFolderFile(req, res))
        this.router.get('/:file_id', (req, res) => this.getFile(req, res))
    }


    public async creatFile(req: Request, res: Response){
        let dataParams = new createFileDTOParams(req.params);
        const publickey: string|any = req.headers['publickey'];
        let dataHeaders = new createFileDTOHeaders(req.headers)


        //validate request body
        try {
			let error = await dataParams.validate();
			if (error) {
				res.status(400).json(error);
				return;
			}
		} catch (error) {
			HandleError(res, error)
			return;
		}
        //validate request headers
        try {
			let error = await dataHeaders.validate();
			if (error) {
				res.status(400).json(error);
				return;
			}
		} catch (error) {
			HandleError(res, error)
			return;
		}


        let folder: Folder ;
        let user: User ;
        let storage : Storage
        let file : File;

        try {

            user = await this.userServcie.findByPublickey(publickey);
            ///////////// check folder access
            folder = await this.folderServcie.findById(dataParams.parent_id , user)
            if(!folder){
                const response: IResponse = {
                    success: false,
                    message: 'شما به این پوشه دسترسی ندارید',
                    data: ''
                }
                res.status(404).json(response)
            }else{
                ///////////// check for storage id
                storage = await this.storageService.findById(dataHeaders.storage_id)
                if(!storage){
                    const response: IResponse = {
                        success: false,
                        message: 'storage not found',
                        data: ''
                    }
                    res.status(404).json(response)
                }else{
                    
                    ///////////// check duplicate file in the same level
                    let check = await this.fileServcie.checkFile(dataParams.name , dataParams.parent_id )
                    if(check){
                        ///////////////// send file to ipfs and get cid
                        const location = await this.ipfsService.cidGenerate(dataHeaders.file)

                        //////////// create the file

                        file = await this.fileServcie.createFile(dataParams, dataHeaders, user, folder, storage, location)

                        //////////// create fileSecret record

                        this.fileSecretService.createFileSecret(dataHeaders.secret, user, file)

                        ////////// update used_storage

                        this.userServcie.updateStorage(user, String( Number(user.storage_used) + Number(dataParams.size) ))

                        ////////// reponse success on creating file
                        const response: IResponse = {
                            success: true,
                            message: '',
                            data: file
                        }
                        res.status(200).json(response)
                    }else{
                        const response: IResponse = {
                            success: false,
                            message: 'یک فایل با این نام وجود دارد',
                            data: ''
                        }
                        res.status(409).json(response)
                    }
                        
                    
                }
            }

           
            
        } catch (error) {
            HandleError(res, error)
        }
    }

    public async getFolderFile(req : Request, res: Response){
        let data =  req.params;
        const publickey: string|any = req.headers['publickey'];

        let files : File[];
        let user: User ;
        let folder : Folder

        try {

            user = await this.userServcie.findByPublickey(publickey);
            console.log(55)

            ///////////check folder
            let folder : Folder = await this.folderServcie.findById(Number(data.parent_id),user)

            if(folder){
                
                files = await this.fileServcie.findByFolder(Number(data.parent_id))
                const response: IResponse = {
                    success: true,
                    message: '',
                    data: files
                }
                res.status(200).json(response)
            }   
            else{
                const response: IResponse = {
                    success: true,
                    message: 'پوشه وجود ندارد یا شما به این پوشه دسترسی ندارید.',
                    data: ''
                }
                res.status(404).json(response)
            }

           
            
        } catch (error) {
            HandleError(res, error)
        }
    }

    public async getFile(req : Request, res: Response){
        let data =  req.params;
        const publickey: string|any = req.headers['publickey'];

        let file : File;
        let user: User ;
        let folder : Folder
        let  record : FileSecret

        try {

            user = await this.userServcie.findByPublickey(publickey);

            ///////////check file
            file = await this.fileServcie.findById(Number(data.file_id))
            if(file){
                ////// searching for secret record
                record = await this.fileSecretService.findRecord(file , user)
                if(record){
                    /////////// decode cid and get the file from ipfs
                    let ipfs_file  = {
                        file : await this.ipfsService.getFile(file.location)
                    }
                    
                    ////////// response on successful file retrive
                    const response: IResponse = {
                        success: true,
                        message: '',
                        data: [file , record , ipfs_file ]
                    }
                    res.status(200).json(response)
                }else{
                    const response: IResponse = {
                        success: false,
                        message: 'شما به این فایل دسترسی ندارید',
                        data: ''
                    }
                    res.status(401).json(response)
                }
            }
            else{
                const response: IResponse = {
                    success: false,
                    message: 'فایل وجود ندارد',
                    data: ''
                }
                res.status(404).json(response)
            }

            
        } catch (error) {
            HandleError(res, error)
        }
    }
}