import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { BaseEntity } from "./BaseEntity.js";
import { TrafficCollection } from "./TrafficCollection.js";
import { Transportation } from "./Transportation.js";




@Entity('traffic_collection_detail')
@Index("idx_traffic_collection_detail_trafficCollection", ["trafficCollection"])
export class TrafficCollectionDetail extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name: 'status', nullable: false })
    status: string;

 
    @ManyToOne(() => TrafficCollection, trafficCollection => trafficCollection.trafficCollectionDetails, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "traffic_collection_id", referencedColumnName: "id" })
    trafficCollection: Relation<TrafficCollection>;

    @OneToMany(() => Transportation, transportations => transportations.trafficCollectionDetail)
    transportations: Relation<Transportation>[];

    

 
}