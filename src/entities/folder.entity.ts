import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Folder extends BaseEntity{
    @PrimaryGeneratedColumn('increment') 
    id: number

    @ManyToOne(() => User)
    owner: User

    @Column({nullable: false})
    name: string

    @ManyToOne( type => Folder , folder => folder.id)
    parent: number


} 