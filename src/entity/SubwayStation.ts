import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Relation } from "typeorm";
import { BaseEntity } from "./BaseEntity.js";
import { BusStation } from "./BusStation.js";




@Entity('subway_station')
export class SubwayStation extends BaseEntity{

    @PrimaryColumn({ type:'int', name : 'subway_id'})
    id: number;

    @Column({ type: 'varchar', name: 'subway_name' })
    subwayName: string;


    @Column({ type: 'double', name: 'x_value' })
    xValue: number;

    @Column({ type: 'double', name: 'y_value' })
    yValue: number;

}