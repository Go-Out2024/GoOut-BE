import { BaseEntity } from "./BaseEntity.js"
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    OneToMany,
    JoinColumn,
    Index,
} from "typeorm"
import { InternalServerError } from "routing-controllers";
import { FirebaseToken } from "./FirebaseToken.js"
import { Relation } from "typeorm";

@Entity("user")
export class User extends BaseEntity {
  
    constructor(numbers:string, email:string) {
        super();
        this.setNumber(numbers);
        this.setEmail(email);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name: 'numbers' })
    numbers: string;

    @Column({ type: 'varchar', name: 'email' })
    email: string;

    @Column({ type: 'boolean', name: 'alarm' })
    alarm: boolean;

    @Column({ type: 'timestamp', name: 'alarm_start' })
    alarmStart: Date;

    @Column({ type: 'timestamp', name: 'alarm_end' })
    alarmEnd: Date;

    @OneToMany(() => FirebaseToken, token => token.user)
    firebaseTokens: Relation<FirebaseToken>[];

    public static createUser(numbers:string, email:string) {
        return new User(numbers, email);
    }

    private setNumber(numbers: string): void {
        if (numbers === null) throw new InternalServerError(`${__dirname} : numbers 값이 존재하지 않습니다.`);
        this.numbers = numbers;
    }

    private setEmail(email: string): void {
        if (email === null) throw new InternalServerError(`${__dirname} : email 값이 존재하지 않습니다.`);
        this.email = email;
    }

    public getNumber() {
        return this.numbers;
    }
    
    public getEmail() {
        return this.email;
    }
}
