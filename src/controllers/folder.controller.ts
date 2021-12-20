import { createFolderDTO } from './../dto/folder.dto';
import { Folder } from './../entities/folder.entity';
import { User } from './../entities/user.entity';
import {Router, Request, Response} from 'express'
import { HandleError } from './../handlesErrors/handleError';
import { FolderService } from './../services/folder.service';
import { UserService } from './../services/user.service';
import { IResponse } from 'interfaces/response.interface';



export class UserController{
    public path: String = "/file-storage/folder";
	public router = Router();

    private folderServcie:FolderService;


    constructor(){
        this.initalRoute()
        this.folderServcie = new FolderService()
    }


    private initalRoute(){
        this.router.post('/:id/:name', (req, res) => this.creatfolder(req, res))
        this.router.post('/:id', (req, res) => this.getfolder(req, res))
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

        const userService = new UserService()
        let user = userService.findById(data.id)

        let folder: Folder ;

        try {

            folder = await this.folderServcie.findByPublickey(data.publickey);
            if(!user){
                user = await this.userServcie.create(data.publickey);
            }

            const response: IResponse = {
                success: true,
                message: '',
                data: user
            }

            res.status(200).json(response)
            
        } catch (error) {
            HandleError(res, error)
        }
    }

    public async getfolder(req : Request, res: Response){

    }
}