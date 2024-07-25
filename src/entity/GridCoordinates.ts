import { BaseEntity } from "./base/BaseEntity.js";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('grid_coordinates')
export class GridCoordinates extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name:'region_code' ,length: 10 })
    regionCode: string;

    @Column({ type: 'varchar',name:'level1', length: 50 })
    level1: string;

    @Column({ type: 'varchar', name:'level2', length: 50 })
    level2: string;

    @Column({ type: 'varchar', name:'level3' ,length: 50 })
    level3: string;

    @Column({ type: 'int', name:'grid_x' })
    gridX: number;

    @Column({ type: 'int', name:'grid_y' })
    gridY: number;

    @Column({ type: 'double', name:'longitude' })
    longitude: number;

    @Column({ type: 'double', name:'latitude' })
    latitude: number;
}
