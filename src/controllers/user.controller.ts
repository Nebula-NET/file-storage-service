import { getUserDTO } from './../dto/user.dto';
import { User } from './../entities/user.entity';
import {Router, Request, Response} from 'express'
import { HandleError } from './../handlesErrors/handleError';
import { UserService } from './../services/user.service';
import { IResponse } from 'interfaces/response.interface';



export class UserController{
    public path: String = "/file-storage/user";
	public router = Router();

    private userServcie:UserService;


    constructor(){
        this.initalRoute()
        this.userServcie = new UserService()
    }


    private initalRoute(){
        this.router.get('/:publickey', (req, res) => this.getUser(req, res))
    }


    public async getUser(req: Request, res: Response){
        let data = new getUserDTO(req.params);

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

        let user: User ;

        try {
            user = await this.userServcie.findByPublickey(data.publickey);
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

}