import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";
import { TrafficCollectionDetail } from "./TrafficCollectionDetail.js";
import { TransportationNumber } from "./TransportationNumber.js";


@Entity('transportation')
export class Transportation extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name: 'route', nullable: false })
    route: string;

    @Column({ type: 'varchar', name: 'transportation_name', nullable: false })
    transportationName: string;

    @Column({ type: 'varchar', name: 'station_name', nullable: false })
    stationName: string;

    @ManyToOne(() => TrafficCollectionDetail, trafficCollectionDetail => trafficCollectionDetail.transportations, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "traffic_collection_detail_id", referencedColumnName: "id" })
    trafficCollectionDetail: Relation<TrafficCollectionDetail>;


    @OneToMany(() => TransportationNumber, transportationNumbers => transportationNumbers.transportation)
    transportationNumbers: Relation<TransportationNumber>[];
}