import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";
import { User } from "./User.js";
import { TrafficCollectionDetail } from "./TrafficCollectionDetail.js";



@Entity('traffic_collection')
@Index("idx_traffic_collection_user", ["user"])
export class TrafficCollection extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name: 'name', nullable: false })
    name: string;

    @Column({ type: 'boolean', name: 'choice', nullable: false, default: true })
    choice: boolean;

    @ManyToOne(() => User, user => user.trafficCollections, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    user: Relation<User>;


    @OneToMany(() => TrafficCollectionDetail, trafficCollectionDetails => trafficCollectionDetails.trafficCollection)
    trafficCollectionDetails: Relation<TrafficCollectionDetail>[];
 
}