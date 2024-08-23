import { Column, Entity, OneToMany, PrimaryColumn, Relation } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";
import { Bus } from "./Bus.js";

@Entity('bus_station')
export class BusStation extends BaseEntity{

    constructor(id:number, staionName:string, stationNum:number, xValue:number, yValue:number){
        super()
        this.setId(id);
        this.setStationName(staionName);
        this.setStationNum(stationNum);
        this.setXValue(xValue);
        this.setYValue(yValue);
    }


    public static createCalendar(id:number, staionName:string, stationNum:number, xValue:number, yValue:number){
        return new BusStation(id, staionName, stationNum, xValue, yValue);
    }

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

    private setId(id:number){
        this.id=id;
    }

    private setStationName(stationName:string){
        this.stationName=stationName;
    }

    private setStationNum(stationNum:number){
        this.stationNum=stationNum;
    }

    private setXValue(xValue:number){
        this.xValue=xValue;
    }

    private setYValue(yValue:number){
        this.yValue=yValue;
    }

    public getId(){
        return this.id;
    }

    public getStationName(){
        return this.stationName;
    }

    public getStationNum(){
        return this.stationNum;
    }

    public getXValue(){
        return this.xValue;
    }

    public getYValue(){
        return this.yValue;
    }

}