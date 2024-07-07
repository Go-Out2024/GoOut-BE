import { BaseEntity } from "./BaseEntity.js"
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    Index,
} from "typeorm"
import { User } from "./User.js"
import { Relation } from "typeorm"
import { JoinColumn } from "typeorm"


@Entity("firebase_token")
@Index("idx_user", ["user"])
export class FirebaseToken extends BaseEntity {
  

    @PrimaryGeneratedColumn()
    id: number

    @Column({type:'varchar', name:"token"})
    token: string

    @ManyToOne(() => User, user => user.firebaseTokens, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    user: Relation<User>;
}


