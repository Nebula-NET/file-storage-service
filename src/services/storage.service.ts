import { Storage } from "./../entities/storage.entity";
import { FileSecret } from "./../entities/fileSecret.entity";
import { createFileDTOParams } from "./../dto/file.dto";
import { createFileDTOHeaders } from "./../dto/file.dto";
import { getRepository } from "typeorm";
import { isEmpty } from "lodash";


export class StorageService{

    private fileRepository = getRepository(Storage)

    constructor(){

    }


    public async findById(storageId: number):Promise<Storage | null>{
        let storage:Storage = await this.fileRepository.findOne({id: storageId});
        return storage
    }

}