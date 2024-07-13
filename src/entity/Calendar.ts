import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";
import { User } from "./User.js";



@Entity('calendar')
@Index("idx_calendar_user", ["user"])
export class Calendar extends BaseEntity{


    constructor(content:string, period:number, kind:string, date:Date){
        super()
        this.setContent(content);
        this.setPeriod(period);
        this.setKind(kind);
        this.setDate(date);
    }


    public static createCalendar(content:string, period:number, kind:string, date:Date){
        return new Calendar(content, period, kind, date);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name: 'calendar_content', nullable: false })
    content: string;

    @Column({ type: 'varchar', name: 'kind', nullable: false })
    kind: string;

    @Column({ type: 'int', name: 'period', nullable: false })
    period: number;

    @Column({ type: 'date', name: 'date', nullable: false })
    date: Date;


    @ManyToOne(() => User, user => user.calendars, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    user: Relation<User>;


    private setContent(content:string){
        this.content=content;
    }

    private setPeriod(period:number){
        this.period=period;
    }

    private setKind(kind:string){
        this.kind=kind;
    }

    private setDate(date:Date){
        this.date=date;
    }





    
}