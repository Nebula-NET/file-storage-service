import { createFileDTOParams } from './../dto/file.dto';
import { createFileDTOHeaders } from './../dto/file.dto';
import { Folder } from './../entities/folder.entity';
import { User } from './../entities/user.entity';
import { File } from './../entities/file.entity';
import { Storage } from './../entities/storage.entity';
import {Router, Request, Response} from 'express'
import { HandleError } from './../handlesErrors/handleError';
import { FolderService } from './../services/folder.service';
import { UserService } from './../services/user.service';
import { FileService } from './../services/file.service';
import { StorageService } from './../services/storage.service';
import { ipfsService } from './../services/ipfs.service';
import { IResponse } from './../interfaces/response.interface';
import * as IPFS from 'ipfs-core'



export class FileController{
    public path: String = "/file-storage/folder/file";
	public router = Router();

    private userServcie:UserService;
    private folderServcie:FolderService;
    private fileServcie:FileService;
    private storageService:StorageService;
    private ipfsService:ipfsService;


    constructor(){
        this.initalRoute()
        this.folderServcie = new FolderService()
        this.userServcie = new UserService()
        this.fileServcie = new FileService()
        this.storageService = new StorageService()
        this.ipfsService = new ipfsService()
    }


    private initalRoute(){
        this.router.post('/:parent_id/file/:name-:size', (req, res) => this.creatFile(req, res))
        this.router.get('/', (req, res) => this.getfolder(req, res))
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
            ///////////// check Folder
            folder = await this.folderServcie.findById(dataParams.parent_id)
            if(!folder){
                const response: IResponse = {
                    success: false,
                    message: 'folder not found',
                    data: ''
                }
                res.status(404).json(response)
            }else{
                storage = await this.storageService.findById(dataHeaders.storage_id)
                if(!storage){
                    const response: IResponse = {
                        success: false,
                        message: 'storage not found',
                        data: ''
                    }
                    res.status(404).json(response)
                }else{
                    user = await this.userServcie.findByPublickey(publickey);
                    if(user){
                        const location = await this.ipfsService.cidGenerate(dataHeaders.file)

                        file = await this.fileServcie.createFile(dataParams, dataHeaders, user, folder, storage, location)
                        const response: IResponse = {
                            success: true,
                            message: '',
                            data: file
                        }
                        res.status(200).json(response)
                    }
                }
            }

           
            
        } catch (error) {
            HandleError(res, error)
        }
    }

    public async getfolder(req : Request, res: Response){


    }
}