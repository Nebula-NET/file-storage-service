import {IsNotEmpty  , validate, IsEmail} from 'class-validator'
import { IResponse } from './../interfaces/response.interface';

export class createFolderDTO{
    constructor(data:any){
        this.name = data.name;
        this.parent = data.parent

    }

    @IsNotEmpty({message: 'لطفا نام پوشه را وارد نمائید'})
    name: string;

    @IsNotEmpty({message: 'parent can not be empty'})
    parent: number;

    @IsNotEmpty({message: 'id can not be empty'})
    id: number;

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