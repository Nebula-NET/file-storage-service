import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import { User } from './user.entity'
import { File } from './file.entity'

@Entity()
export class FileSecret extends BaseEntity{
    @PrimaryGeneratedColumn('increment') 
    id: number

    @Column({nullable: false , length:32})
    secret: string

    @ManyToOne(() => User)
    owner: User

    @ManyToOne( () => File)
    file_id: File

    
} 