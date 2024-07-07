import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Relation } from "typeorm";
import { BaseEntity } from "./BaseEntity.js";
import { BusStation } from "./BusStation.js";




@Entity('bus')
export class Bus extends BaseEntity{

    @PrimaryColumn({ type:'int', name : 'bus_id'})
    id: number;

    @Column({ type: 'varchar', name: 'bus_name' })
    busName: string;


    @ManyToOne(() => BusStation, busStation => busStation.buss, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "bus_station_id", referencedColumnName: "id" })
    busStation: Relation<BusStation>;

}