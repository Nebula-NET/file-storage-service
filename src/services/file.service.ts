import { Folder } from "./../entities/folder.entity";
import { User } from "./../entities/user.entity";
import { File } from "./../entities/file.entity";
import { Storage } from "./../entities/storage.entity";
import { FileSecret } from "./../entities/fileSecret.entity";
import { createFileDTOParams } from "./../dto/file.dto";
import { createFileDTOHeaders } from "./../dto/file.dto";
import { getRepository } from "typeorm";
import { isEmpty } from "lodash";


export class FileService{

    private fileRepository = getRepository(File)

    constructor(){

    }


    public async findById(fileId: number):Promise<File | null>{
        let file:File = await this.fileRepository.findOne({id: fileId});
        return file
    }

    public async findByFolder(folderId: number , userId : number):Promise<File[] | null>{
        let file:File[] = await this.fileRepository.find({ where: { owner: userId , folder : folderId }});
        return file
    }

    public async createFile(dataParams : createFileDTOParams , dataHeaders : createFileDTOHeaders , user : User , folder : Folder , storage : Storage , location : string):Promise<File>{
        let file: File = new File();
        file.name = dataParams.name;
        file.size = dataParams.size 
        file.created_at = dataHeaders.created_at  

        file.location = location
        file.folder = folder
        file.owner = user 
        file.storage = storage

        await file.save();
        return file
    }

    public async checkFile(name: string , parent: number , userId : number ):Promise<Boolean>{
        let file : File[] = await this.fileRepository.find({ where: { owner: userId , parent : parent , name :name }})

        if ( file.length == 0)
            return true

        return false

    }



}