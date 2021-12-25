import {IsNotEmpty  , validate, IsEmail} from 'class-validator'
import { IResponse } from './../interfaces/response.interface';

export class createFileDTO{
    constructor(data:any){
        this.name = data.name;
        this.parent = data.parent
        this.created_at = data.created_at
        this.updated_at = data.updated_at
        this.size = data.size
    }

    @IsNotEmpty({message: 'لطفا نام پوشه را وارد نمائید'})
    name: string;

    @IsNotEmpty({message: 'parent can not be empty'})
    parent_id: number;

    @IsNotEmpty({message: 'size can not be empty'})
    size: string;

    @IsNotEmpty({message: 'created _at can not be empty'})
    created_at: string;

    @IsNotEmpty({message: 'updated_at can not be empty'})
    updated_at: string;

    @IsNotEmpty({message: 'storage_id can not be empty'})
    storage_id: number;

    @IsNotEmpty({message: 'owner_id can not be empty'})
    owner_id: number;

    

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