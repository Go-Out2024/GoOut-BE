import { PhotoManyToOne } from "./PhotoManyToOne.js"
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"




@Entity()
export class UserOneToMany {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => PhotoManyToOne, (photo) => photo.user)
    photos: PhotoManyToOne[]
}