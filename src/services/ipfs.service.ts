import { getRepository } from "typeorm";
import { isEmpty } from "lodash";
import * as IPFS from 'ipfs-core'


export class StorageService{
    constructor(){

    }


    public async cidGenerate(file: string):Promise<string>{
        const ipfs = await IPFS.create()
        const { cid } = await ipfs.add(file)
        return cid.toString()
    }

}