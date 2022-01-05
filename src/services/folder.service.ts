import { Folder } from "./../entities/folder.entity";
import { User } from "./../entities/user.entity";
import { getRepository } from "typeorm";
import { isEmpty } from "lodash";


export class FolderService{

    private folderRepository = getRepository(Folder)


    constructor(){

    }


    public async findById(folderId: number , user : User):Promise<Folder | null>{
        let folder:Folder = await this.folderRepository.findOne({id: folderId , owner : user});
        return folder
    }

    public async findByParentFolder(userId: number , parent: number):Promise<Folder[] | null>{
        let folder:Folder[] = await this.folderRepository.find({ where: { owner: userId , parent : parent }});
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

    
    public async getRootFolder(userId: number ):Promise<Folder[] | null>{
        let folder:Folder[] = await this.folderRepository.find({ where: { owner: userId , parent : null}});
        return folder
    }


}