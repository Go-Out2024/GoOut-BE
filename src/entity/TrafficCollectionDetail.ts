import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";
import { TrafficCollection } from "./TrafficCollection.js";
import { Transportation } from "./Transportation.js";

@Entity('traffic_collection_detail')
@Index("idx_traffic_collection_detail_trafficCollection", ["trafficCollection"])
export class TrafficCollectionDetail extends BaseEntity {

    constructor(status: string, trafficCollectionId: number) {
        super();
        this.setStatus(status);
        this.setTrafficCollectionId(trafficCollectionId);
    }

    public static createTrafficCollectionDetail(status: string, trafficCollectionId: number) {
        return new TrafficCollectionDetail(status, trafficCollectionId);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name: 'status', nullable: false })
    status: string;

    @Column({ type: 'int', name: 'traffic_collection_id', nullable: false })
    trafficCollectionId: number;

    @ManyToOne(() => TrafficCollection, trafficCollection => trafficCollection.trafficCollectionDetails, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "traffic_collection_id", referencedColumnName: "id" })
    trafficCollection: Relation<TrafficCollection>;

    @OneToMany(() => Transportation, transportations => transportations.trafficCollectionDetail)
    transportations: Relation<Transportation>[];

    private setStatus(status: string) {
        this.status = status;
    }

    private setTrafficCollectionId(trafficCollectionId: number) {
        this.trafficCollectionId = trafficCollectionId;
    }

    public getStatus() {
        return this.status;
    }

    public getId() {
        return this.id;
    }
}
