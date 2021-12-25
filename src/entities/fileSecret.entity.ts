import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn ,PrimaryColumn , Generated} from 'typeorm'
import { User } from './user.entity'
import { File } from './file.entity'

@Entity()
export class FileSecret extends BaseEntity{
    @Generated('increment') 
    id: number

    @Column({nullable: false , length:32})
    secret: string

    @ManyToOne(() => User)
    owner: User

    @PrimaryColumn()
    ownerId: string;

    @ManyToOne( () => File)
    file: File

    @PrimaryColumn()
    fileId: string;

    
} 