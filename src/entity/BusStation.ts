import { Column, Entity, OneToMany, PrimaryColumn, Relation } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";
import { Bus } from "./Bus.js";




@Entity('bus_station')
export class BusStation extends BaseEntity{

    @PrimaryColumn({ type:'varchar', name : 'bus_station_id'})
    id: number;

    @Column({ type: 'varchar', name: 'station_name', nullable: false })
    stationName: string;

    @Column({ type: 'int', name: 'station_num', nullable: false })
    stationNum: number;

    @Column({ type: 'double', name: 'x_value', nullable: false })
    xValue: number;

    @Column({ type: 'double', name: 'y_value', nullable: false })
    yValue: number;

    @OneToMany(() => Bus, buss => buss.busStation)
    buss: Relation<Bus>[];
}