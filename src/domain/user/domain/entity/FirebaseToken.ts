import { BaseEntity } from "../../../../global/entitiy/BaseEntity.js"
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from "typeorm"
import { User } from "./User.js"

@Entity("FirebaseToken")
export class FirebaseToken extends BaseEntity {
  
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    token: string

    @ManyToOne(() => User, user => user.firebaseTokens)
    user: User
}