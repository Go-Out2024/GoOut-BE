import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";
import { User } from "./User.js";



@Entity('calendar')
@Index("idx_calendar_user", ["user"])
export class Calendar extends BaseEntity{


    constructor(content:string, period:number, kind:string, date:Date, userId:number){
        super()
        this.setContent(content);
        this.setPeriod(period);
        this.setKind(kind);
        this.setDate(date);
        this.setUserId(userId);
    }


    public static createCalendar(content:string, period:number, kind:string, date:Date, userId:number){
        return new Calendar(content, period, kind, date, userId);
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

    @Column({ type: 'int', name: 'user_id', nullable: false})
    userId: number;


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

    private setUserId(userId:number){
        this.userId=userId;
    }

    public getDate(){
        return this.date;
    }

    public getPeriod(){
        return this.period;
    }

    public getContent(){
        return this.content;
    }

    public getKind(){
        return this.kind;
    }

    public getId(){
        return this.id;
    }





    
}