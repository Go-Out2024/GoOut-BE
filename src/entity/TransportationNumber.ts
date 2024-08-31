import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Transportation } from "./Transportation";

@Entity("transportation_number")
@Index("idx_transportation_number_transportation", ["transportation"])
export class TransportationNumber {

    constructor(numbers: string, transportationId: number) {
        this.setNumbers(numbers);
        this.setTransportationId(transportationId);
    }

    public static createTransportationNumber(numbers: string, transportationId: number) {
        return new TransportationNumber(numbers, transportationId);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name: 'numbers', nullable: false })
    numbers: string;

    @Column({ type: 'int', name: 'transportation_id', nullable: false })
    transportationId: number;

    @ManyToOne(() => Transportation, transportation => transportation.transportationNumbers, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "transportation_id", referencedColumnName: "id" })
    transportation: Relation<Transportation>;

    private setNumbers(numbers: string) {
        this.numbers = numbers;
    }

    private setTransportationId(transportationId: number) {
        this.transportationId = transportationId;
    }

    public getNumbers() {
        return this.numbers;
    }

    public getId() {
        return this.id;
    }
}
