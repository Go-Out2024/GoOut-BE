import { Column, Entity,  PrimaryColumn, PrimaryGeneratedColumn, } from "typeorm";
import { BaseEntity } from "./base/BaseEntity";




@Entity('subway_station')
export class SubwayStation extends BaseEntity{

    constructor(id: number, subwayName: string, xValue: number, yValue: number) {
        super()
        this.setId(id);
        this.setSubwayName(subwayName);
        this.setXValue(xValue);
        this.setYValue(yValue);
    }

    
    public static createSubwayStation(id: number, subwayName: string, xValue: number, yValue: number){
        return new SubwayStation(id, subwayName, xValue, yValue);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name: 'subway_name', nullable: false })
    subwayName: string;
    
    @Column({ type: 'double', name: 'x_value', nullable: false })
    xValue: number;

    @Column({ type: 'double', name: 'y_value', nullable: false })
    yValue: number;

    private setId(id: number) {
        this.id = id;
    }

    private setSubwayName(subwayName: string) {
        this.subwayName = subwayName;
    }
    
    private setXValue(xValue: number) {
        this.xValue = xValue;
    }

    private setYValue(yValue: number) {
        this.yValue = yValue;
    }

    public getId() {
        return this.id;
    }

    public getSubwayName() {
        return this.subwayName;
    }

    public getXValue() {
        return this.xValue;
    }
    
    public getYValue() {
        return this.yValue;
    }

}