import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";
import { User } from "./User.js";
import { TrafficCollectionDetail } from "./TrafficCollectionDetail.js";

@Entity('traffic_collection')
@Index("idx_traffic_collection_user", ["userId"])
export class TrafficCollection extends BaseEntity{

    constructor(name: string, choice: boolean, userId: number) {
        super();
        this.setName(name);
        this.setChoice(choice);
        this.setUserId(userId);
    }

    public static createTrafficCollection(name: string, choice: boolean, userId: number) {
        return new TrafficCollection(name, choice, userId);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name: 'name', nullable: false })
    name: string;

    @Column({ type: 'boolean', name: 'choice', nullable: false, default: true })
    choice: boolean;

    @Column({ type: 'int', name: 'user_id', nullable: false })
    userId: number;

    @ManyToOne(() => User, user => user.trafficCollections, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    user: Relation<User>;

    @OneToMany(() => TrafficCollectionDetail, trafficCollectionDetails => trafficCollectionDetails.trafficCollection)
    trafficCollectionDetails: Relation<TrafficCollectionDetail>[];

    private setName(name: string) {
        this.name = name;
    }

    private setChoice(choice: boolean) {
        this.choice = choice;
    }

    private setUserId(userId: number) {
        this.userId = userId;
    }

    public getName() {
        return this.name;
    }

    public getChoice() {
        return this.choice;
    }

    public getId() {
        return this.id;
    }
}
