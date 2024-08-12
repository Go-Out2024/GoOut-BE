import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";
import { BusStation } from "./BusStation.js";




@Entity('bus')
export class Bus extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', name: 'bus_id', nullable: false })
    busId: number;

    @Column({ type: 'varchar', name: 'bus_name', nullable: false })
    busName: string;

    @Column({ type: 'int', name: 'sequence', nullable: false })
    sequence: number;

    @Column({ type: 'int', name: 'bus_station_id', nullable: false })
    busStationId: number;

    @ManyToOne(() => BusStation, busStation => busStation.buss, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "bus_station_id", referencedColumnName: "id" })
    busStation: Relation<BusStation>;

}