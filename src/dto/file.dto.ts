import {IsNotEmpty  , validate, IsEmail} from 'class-validator'
import { IResponse } from './../interfaces/response.interface';

export class createFileDTOParams{
    constructor(data:any){
        this.name = data.name;
        this.parent_id = data.parent_id
        this.size = data.size
    }

    @IsNotEmpty({message: 'لطفا نام فایل را وارد نمائید'})
    name: string;

    @IsNotEmpty({message: 'parent can not be empty'})
    parent_id: number;

    @IsNotEmpty({message: 'size can not be empty'})
    size: string;


    

    public async validate():Promise<IResponse | null>{
        let errors = await validate(this);            
        if(errors.length > 0){
          const resData: IResponse = {
              success: false,
              message: errors[0].constraints[Object.keys(errors[0].constraints)[0]],
              data: errors[0]
          }
          return resData
        } else {
            return null
        } 

    }
}

export class createFileDTOHeaders{
    constructor(data:any){
        this.created_at = data.created_at;
        this.storage_id = data.storage_id
        this.file = data.file
        this.secret = data.secret
    }

    @IsNotEmpty({message: 'created _at can not be empty'})
    created_at: string;

    @IsNotEmpty({message: 'storage_id can not be empty'})
    storage_id: number;

    @IsNotEmpty({message: 'file string can not be empty'})
    file: string;

    @IsNotEmpty({message: 'secret can not be empty'})
    secret: string;

    

    public async validate():Promise<IResponse | null>{
        let errors = await validate(this);            
        if(errors.length > 0){
          const resData: IResponse = {
              success: false,
              message: errors[0].constraints[Object.keys(errors[0].constraints)[0]],
              data: errors[0]
          }
          return resData
        } else {
            return null
        } 

    }
}