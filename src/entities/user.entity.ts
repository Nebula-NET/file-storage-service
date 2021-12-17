import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm'


@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn('increment') 
    id: number

    @Column({nullable: false})
    public_key: string

    @Column({nullable: false, default: '1073741824'}) // 1 GIG
    storage_limit: string

    @Column({nullable: false, default: '0'})
    storage_used: string
} 