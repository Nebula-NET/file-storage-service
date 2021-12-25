import { Folder } from "./../entities/folder.entity";
import { User } from "./../entities/user.entity";
import { File } from "./../entities/file.entity";
import { Storage } from "./../entities/storage.entity";
import { FileSecret } from "./../entities/fileSecret.entity";
import { createFileDTO } from "./../dto/file.dto";
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

    public async create(data : createFileDTO , user : User , folder : Folder , storage : Storage):Promise<Folder>{
        let file: File = new File();
        file.name = data.name;
        file.size = data.size 
        file.created_at = data.created_at 
        file.updated_at = data.updated_at 

        file.folder = folder
        file.owner = user 
        file.storage = storage

        await folder.save();
        return folder
    }

    public async checkFile(name: string , parent: number , userId : number ):Promise<Boolean>{
        let file : File[] = await this.fileRepository.find({ where: { owner: userId , parent : parent , name :name }})

        if ( file.length == 0)
            return true

        return false

    }



}