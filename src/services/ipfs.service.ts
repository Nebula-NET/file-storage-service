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


        // const stream = this.ipfs.cat('QmaQdLVhfspQmnfv4oR86cL7VdWsY2K8q6h6EQNoUmSqBi')
        // let data = ''

        // for await (const chunk of stream) {
        // // chunks of data are returned as a Buffer, convert it back to a string
        // data += chunk.toString()
        // }

        // console.log(data)

        return cid.toString()

    }

    public async getFile(cid: string):Promise<string>{
        if(!this.ready){
            const ipfs = await IPFS.create()
            this.ipfs = ipfs
            this.ready = true
        }
       


        const stream = this.ipfs.cat(cid)
        let data = ''

        for await (const chunk of stream) {
        // chunks of data are returned as a Buffer, convert it back to a string
        data += chunk.toString()
        }


        return data

    }




}