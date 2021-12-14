import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm'


@Entity()
export class Project extends BaseEntity{
    @PrimaryGeneratedColumn('increment') 
    id: number

    @Column({nullable: false})
    public_key: number

    @Column({nullable: true})
    storage_limit: string

    @Column({nullable: false})
    storage_used: string
} 