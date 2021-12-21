import { createFolderDTO } from './../dto/folder.dto';
import { Folder } from './../entities/folder.entity';
import { User } from './../entities/user.entity';
import {Router, Request, Response} from 'express'
import { HandleError } from './../handlesErrors/handleError';
import { FolderService } from './../services/folder.service';
import { UserService } from './../services/user.service';
import { IResponse } from 'interfaces/response.interface';



export class FolderController{
    public path: String = "/file-storage/folder";
	public router = Router();

    private folderServcie:FolderService;


    constructor(){
        this.initalRoute()
        this.folderServcie = new FolderService()
    }


    private initalRoute(){
        this.router.post('/:id/:name-:parent', (req, res) => this.creatfolder(req, res))
        this.router.get('/:id', (req, res) => this.getfolder(req, res))
    }


    public async creatfolder(req: Request, res: Response){
        let data = new createFolderDTO(req.params);

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

        try {
            ///////////// check duplicate folder in the same level
            let check = await this.folderServcie.checkfolder(data.name , data.parent , data.id)
            if(check){
                ///////////find user base on id
                const userService = new UserService()
                let user = await userService.findById(data.id)

                ////////// create folder
                console.log(data.name)
                console.log(data.parent)
                console.log(data.id)
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

           
            
        } catch (error) {
            HandleError(res, error)
        }
    }

    public async getfolder(req : Request, res: Response){
        res.status(200).json(req.params.id)
    }   
}