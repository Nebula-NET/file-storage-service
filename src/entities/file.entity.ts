import {BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import { User } from './user.entity'
import { Storage } from './storage.entity'
import { Folder } from './folder.entity'

@Entity()
export class File extends BaseEntity{
    @PrimaryGeneratedColumn('increment') 
    id: number

    @ManyToOne(() => User)
    owner: User

    @Column({nullable: false})
    name: string

    @Column({nullable: true})
    size: string

    @Column({nullable: false})
    location: string

    @Column({ type: 'date' })
    created_at: string

    @Column({ type: 'date' })
    updated_at: string

    @ManyToOne(() => Storage)
    storage: Storage

    @ManyToOne(() => Folder)
    folder: Folder

} 