



import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { User } from "./User.js"

@Entity("Profile")
export class Profile {
    @PrimaryGeneratedColumn()
    id: number



    @Column()
    photo: string

    @OneToOne(() => User)
    @JoinColumn()
    user: User
    
}
