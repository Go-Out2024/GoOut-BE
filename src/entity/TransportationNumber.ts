import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Transportation } from "./Transportation.js";



@Entity("transportation_number")
export class TransportationNumber{


    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name: 'numbers', nullable: false })
    numbers: string;

    @ManyToOne(() => Transportation,  transportation =>  transportation.transportationNumbers, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "tsransportation_id", referencedColumnName: "id" })
    transportation: Relation<Transportation>;


}