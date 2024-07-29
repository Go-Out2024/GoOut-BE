import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";
import { TrafficCollectionDetail } from "./TrafficCollectionDetail.js";
import { TransportationNumber } from "./TransportationNumber.js";

@Entity('transportation')
export class Transportation extends BaseEntity {

    constructor(route: string, transportationName: string, stationName: string, trafficCollectionDetailId: number) {
        super();
        this.setRoute(route);
        this.setTransportationName(transportationName);
        this.setStationName(stationName);
        this.setTrafficCollectionDetailId(trafficCollectionDetailId);
    }

    public static createTransportation(route: string, transportationName: string, stationName: string, trafficCollectionDetailId: number) {
        return new Transportation(route, transportationName, stationName, trafficCollectionDetailId);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name: 'route', nullable: false })
    route: string;

    @Column({ type: 'varchar', name: 'transportation_name', nullable: false })
    transportationName: string;

    @Column({ type: 'varchar', name: 'station_name', nullable: false })
    stationName: string;

    @Column({ type: 'int', name: 'traffic_collection_detail_id', nullable: false })
    trafficCollectionDetailId: number;

    @ManyToOne(() => TrafficCollectionDetail, trafficCollectionDetail => trafficCollectionDetail.transportations, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "traffic_collection_detail_id", referencedColumnName: "id" })
    trafficCollectionDetail: Relation<TrafficCollectionDetail>;

    @OneToMany(() => TransportationNumber, transportationNumbers => transportationNumbers.transportation)
    transportationNumbers: Relation<TransportationNumber>[];

    private setRoute(route: string) {
        this.route = route;
    }

    private setTransportationName(transportationName: string) {
        this.transportationName = transportationName;
    }

    private setStationName(stationName: string) {
        this.stationName = stationName;
    }

    private setTrafficCollectionDetailId(trafficCollectionDetailId: number) {
        this.trafficCollectionDetailId = trafficCollectionDetailId;
    }

    public getRoute() {
        return this.route;
    }

    public getTransportationName() {
        return this.transportationName;
    }

    public getStationName() {
        return this.stationName;
    }

    public getId() {
        return this.id;
    }
}
