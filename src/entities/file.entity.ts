import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import { User } from './user.entity'

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
    storage_id: Storage

    @ManyToOne(() => Folder)
    foldr_id: Folder

} 