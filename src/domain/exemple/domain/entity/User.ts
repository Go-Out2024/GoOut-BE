import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { BaseEntity } from "../../../../global/entitiy/BaseEntity.js"


@Entity("User")
export class User extends BaseEntity{


    
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    isActive: boolean

    // @Column()
    // profile:Profile


}