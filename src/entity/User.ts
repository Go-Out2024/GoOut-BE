import { BaseEntity } from "./base/BaseEntity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  Index,
} from "typeorm";
import { InternalServerError } from "routing-controllers";
import { FirebaseToken } from "./FirebaseToken";
import { Relation } from "typeorm";
import { Calendar } from "./Calendar";
import { TrafficCollection } from "./TrafficCollection";

@Entity("user")
export class User extends BaseEntity {
  constructor(numbers: string, email: string) {
    super();
    this.setNumber(numbers);
    this.setEmail(email);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", name: "numbers", nullable: false })
  numbers: string;

  @Column({ type: "varchar", name: "email", nullable: false })
  email: string;

  @Column({ type: "boolean", name: "alarm", nullable: false, default: true })
  alarm: boolean;

  @Column({ type: "time", name: "alarm_start", nullable: true })
  alarmStart: string;

  @Column({ type: "time", name: "alarm_end", nullable: true })
  alarmEnd: string;

  @OneToMany(() => FirebaseToken, (token) => token.user)
  firebaseTokens: Relation<FirebaseToken>[];

  @OneToMany(() => Calendar, (calendar) => calendar.user)
  calendars: Relation<Calendar>[];

  @OneToMany(
    () => TrafficCollection,
    (trafficCollections) => trafficCollections.user
  )
  trafficCollections: Relation<TrafficCollection>[];

  public static createUser(numbers: string, email: string) {
    return new User(numbers, email);
  }

  private setNumber(numbers: string): void {
    if (numbers === null)
      throw new InternalServerError(
        `${__dirname} : numbers 값이 존재하지 않습니다.`
      );
    this.numbers = numbers;
  }

  private setEmail(email: string): void {
    if (email === null)
      throw new InternalServerError(
        `${__dirname} : email 값이 존재하지 않습니다.`
      );
    this.email = email;
  }

  public getNumber() {
    return this.numbers;
  }

  public getEmail() {
    return this.email;
  }

  public getAlarm() {
    return this.alarm;
  }
}
