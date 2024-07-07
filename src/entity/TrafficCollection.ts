import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { BaseEntity } from "./BaseEntity.js";
import { User } from "./User.js";



@Entity('traffic_collection')
@Index("idx_traffic_collection_user", ["user"])
export class TrafficCollection extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name: 'name' })
    name: string;

    @Column({ type: 'boolean', name: 'choice' })
    choice: boolean;

    @ManyToOne(() => User, user => user.trafficCollections, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    user: Relation<User>;



    
}