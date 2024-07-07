import { Column, Entity, PrimaryColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity.js";




@Entity('bus_station')
export class BusStation extends BaseEntity{

    @PrimaryColumn({ type:'varchar', name : 'bus_station_id'})
    id: number;

    @Column({ type: 'varchar', name: 'station_name' })
    stationName: string;

    @Column({ type: 'int', name: 'station_num' })
    stationNum: number;

    @Column({ type: 'double', name: 'x_value' })
    xValue: number;

    @Column({ type: 'double', name: 'y_value' })
    yValue: number;
}