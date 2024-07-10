import { Column, Entity,  PrimaryColumn, } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";
import { BusStation } from "./BusStation.js";




@Entity('subway_station')
export class SubwayStation extends BaseEntity{

    @PrimaryColumn({ type:'int', name : 'subway_id'})
    id: number;

    @Column({ type: 'varchar', name: 'subway_name', nullable: false })
    subwayName: string;


    @Column({ type: 'double', name: 'x_value', nullable: false })
    xValue: number;

    @Column({ type: 'double', name: 'y_value', nullable: false })
    yValue: number;

}