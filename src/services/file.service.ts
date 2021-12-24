import { Folder } from "./../entities/folder.entity";
import { User } from "./../entities/user.entity";
import { File } from "./../entities/file.entity";
import { FileSecret } from "./../entities/fileSecret.entity";
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

    public async findByUser(userId: number):Promise<Folder[] | null>{
        let folder:Folder[] = await this.folderRepository.find({ where: { owner: userId }});
        return folder
    }

    public async create(name: string , parent: number | null , user : User):Promise<Folder>{
        let folder: Folder = new Folder();
        folder.name = name;
        folder.parent = parent
        folder.owner = user 
        await folder.save();
        return folder
    }

    public async checkfolder(name: string , parent: number , userId : number ):Promise<Boolean>{
        let folder : Folder[] = await this.folderRepository.find({ where: { owner: userId , parent : parent , name :name }})

        if ( folder.length == 0)
            return true

        return false

    }



}