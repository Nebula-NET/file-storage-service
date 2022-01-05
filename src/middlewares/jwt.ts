import {Request , Response ,  NextFunction } from 'express';
import { HandleError, Exception } from './../handlesErrors/handleError';
import { IResponse } from '../interfaces/response.interface';
import { AuthService } from './../services/authService';



export async function verifyUser(req : Request , res : Response , next:NextFunction){
    try {
        const token = req.headers['authorization']
        const deviceId: string|any = req.headers['device-id'];
        const publickey: string|any = req.headers['publickey'];
        const platformVersion : string|any = req.headers['platform-version'];
        const lang : string|any = req.headers['accept-language'];

        const authService = new AuthService();
        let result:IResponse = await authService.checkToken(token, publickey, deviceId, lang, platformVersion).then((result: any) => result.data);
        req.headers['user-email'] = result.data.email
        next();
    } catch (err) {        
        if(err instanceof Exception){
            HandleError(res, err)
        }else{
            let error = new Exception(401, 'شما دسترسی لازم برای انجام این عملیات را ندارید');
            HandleError(res, error)
        }
    }
}