import { createFolderDTO } from './../dto/folder.dto';
import { Folder } from './../entities/folder.entity';
import { User } from './../entities/user.entity';
import {Router, Request, Response} from 'express'
import { HandleError } from './../handlesErrors/handleError';
import { FolderService } from './../services/folder.service';
import { UserService } from './../services/user.service';
import { IResponse } from 'interfaces/response.interface';
import { access } from 'fs';



export class FolderController{
    public path: String = "/file-storage/folder";
	public router = Router();

    private userServcie:UserService;
    private folderServcie:FolderService;


    constructor(){
        this.initalRoute()
        this.folderServcie = new FolderService()
        this.userServcie = new UserService()
    }


    private initalRoute(){
        this.router.post('/:parent/:name', (req, res) => this.creatfolder(req, res))
        this.router.get('/:parent_id', (req, res) => this.getFolderByParent(req, res))
        this.router.get('/parent/root', (req, res) => this.getRootFolder(req, res))
    }


    public async creatfolder(req: Request, res: Response){
        let data = new createFolderDTO(req.params);
        const publickey: string|any = req.headers['publickey'];

        //validate request body
        try {
			let error = await data.validate();
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

        try {
            user = await this.userServcie.findByPublickey(publickey);

            let folder_access : Folder = await this.folderServcie.findById(data.parent , user)
            if(folder_access){
            ///////////// check duplicate folder in the same level
                let check = await this.folderServcie.checkfolder(data.name , data.parent , user.id )
                if(check){
                    ////////// create folder
                    folder = await this.folderServcie.create(data.name, data.parent , user );
                    const response: IResponse = {
                        success: true,
                        message: '',
                        data: folder
                    }
                    res.status(200).json(response)
                }else{
                    ////////// response on finding duplicate folder
                    const response: IResponse = {
                        success: false,
                        message: 'یک پوشه با این نام وجود دارد',
                        data: ''
                    }
                    res.status(409).json(response)
                }
            }else{
                const response: IResponse = {
                    success: false,
                    message: 'شما به این پوشه دسترسی ندارید',
                    data: ''
                }
                res.status(401).json(response)
            }

           
            
        } catch (error) {
            HandleError(res, error)
        }
    }

    public async getFolderByParent(req : Request, res: Response){
        let parentId : string = req.params.parent_id
        const publickey: string|any = req.headers['publickey'];
       

        let user: User = await this.userServcie.findByPublickey(publickey);
        

        try {
            let folder : Folder = await this.folderServcie.findById(Number(parentId),user)

            if(folder){
                
                let folders : Folder[] = await this.folderServcie.findByParentFolder(user.id , Number(parentId) )
                const response: IResponse = {
                    success: true,
                    message: '',
                    data: folders
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

    public async getRootFolder(req : Request, res: Response){
        console.log(10)
        const publickey: string|any = req.headers['publickey'];
       

        let user: User = await this.userServcie.findByPublickey(publickey);
        let folder : Folder[]
        console.log(user)
        try {
          
            folder = await this.folderServcie.getRootFolder(user.id)
            console.log(folder)
            if(folder.length != 0){
                const response: IResponse = {
                    success: true,
                    message: '',
                    data: folder 
                }
                res.status(200).json(response)
            }else{
                const response: IResponse = {
                    success: false,
                    message: 'root folder not found',
                    data: ''
                }
                res.status(404).json(response)
            }
            
        } catch (error) {
            HandleError(res, error)
        }
    }
}