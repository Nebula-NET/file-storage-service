import { User } from "./../entities/user.entity";
import { getRepository } from "typeorm";


export class UserService{

    private userRepository = getRepository(User)


    constructor(){

    }


    public async findById(userId: number):Promise<User | null>{
        let user:User = await this.userRepository.findOne({id: userId});
        return user
    }

    public async findByPublickey(publickey: string):Promise<User | null>{
        let user:User = await this.userRepository.findOne({public_key : publickey});
        return user
    }

    public async create(publickey: string):Promise<User>{
        let user: User = new User();
        user.public_key = publickey;
        await user.save();
        return user
    }



}