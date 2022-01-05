import { Folder } from "./../entities/folder.entity";
import { File } from "./../entities/file.entity";
import { Storage } from "./../entities/storage.entity";
import { User } from "./../entities/user.entity";
import { FileSecret } from "./../entities/fileSecret.entity";
import { createFileDTOParams } from "./../dto/file.dto";
import { createFileDTOHeaders } from "./../dto/file.dto";
import { getRepository } from "typeorm";
import { isEmpty } from "lodash";


export class FileSecretService{

    private fileSecretRepository = getRepository(FileSecret)

    constructor(){

    }


    public async findRecord(file: File , user : User ):Promise<FileSecret | null>{
        let fileSecret:FileSecret = await this.fileSecretRepository.findOne({file: file , owner : user});
        return fileSecret
    }


    public async createFileSecret( secret : string , user : User , file : File ):Promise<FileSecret>{
        let fileSecret: FileSecret = new FileSecret();
        fileSecret.secret = secret
        fileSecret.owner = user
        fileSecret.file = file

        await fileSecret.save();
        return fileSecret
    }

    

}