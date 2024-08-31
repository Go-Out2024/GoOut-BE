import { BaseEntity } from "./base/BaseEntity"
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    Index,
} from "typeorm"
import { User } from "./User"
import { Relation } from "typeorm"
import { JoinColumn } from "typeorm"


@Entity("firebase_token")
@Index("idx_firebasetoken_user", ["user"])
export class FirebaseToken extends BaseEntity {
  

    @PrimaryGeneratedColumn()
    id: number

    @Column({type:'varchar', name:"token", nullable: false})
    token: string

    @ManyToOne(() => User, user => user.firebaseTokens, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    user: Relation<User>;
}


