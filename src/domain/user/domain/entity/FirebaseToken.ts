import { BaseEntity } from "../../../../global/entitiy/BaseEntity.js"
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from "typeorm"
import { User } from "./User.js"
import { Relation } from "typeorm"
import { JoinColumn } from "typeorm"


@Entity("FirebaseToken")
export class FirebaseToken extends BaseEntity {
  
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    token: string

    @ManyToOne(() => User, user => user.firebaseTokens, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    user: Relation<User>;
}


