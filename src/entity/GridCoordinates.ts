import { BaseEntity } from "./base/BaseEntity.js";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('grid_coordinates')
export class GridCoordinates extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 10 })
    regionCode: string;

    @Column({ type: 'varchar', length: 50 })
    level1: string;

    @Column({ type: 'varchar', length: 50 })
    level2: string;

    @Column({ type: 'varchar', length: 50 })
    level3: string;

    @Column({ type: 'int' })
    gridX: number;

    @Column({ type: 'int' })
    gridY: number;

    @Column({ type: 'double' })
    longitude: number;

    @Column({ type: 'double' })
    latitude: number;
}
