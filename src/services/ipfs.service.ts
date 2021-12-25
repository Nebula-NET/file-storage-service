import { getRepository } from "typeorm";
import { isEmpty } from "lodash";
import * as IPFS from 'ipfs-core'


export class ipfsService{

    private ipfs : IPFS.IPFS
    private ready : boolean

    constructor(){
        this.ready = false
    }


    public async cidGenerate(file: string):Promise<string>{
        if(!this.ready){
            const ipfs = await IPFS.create()
            this.ipfs = ipfs
            this.ready = true
        }
       
        const { cid } = await this.ipfs.add(file)
        return cid.toString()
    }

}