import { BaseEntity } from "./BaseEntity.js"
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    OneToMany,
    JoinColumn,
} from "typeorm"
import { InternalServerError } from "routing-controllers";
import { FirebaseToken } from "./FirebaseToken.js"
import { Relation } from "typeorm";

@Entity("User")
export class User extends BaseEntity{
  
    constructor(numbers:string, email:string){
        super();
        this.setNumber(numbers)
        this.setEmail(email)
    }



    @PrimaryGeneratedColumn()
    id: number

    @Column()
    numbers:string;

    @Column()
    email: string;

    @OneToMany(() => FirebaseToken, token => token.user)
    firebaseTokens: Relation<FirebaseToken>[]
   
    public static createUser(numbers:string, email:string){
        return new User(numbers, email)
    }
    // 외부에서 쉽게 'User' 인스턴스 생성 가능

    private setNumber(numbers:string): void{
        if(numbers === null) throw new InternalServerError(`${__dirname} : nickname 값이 존재하지 않습니다.`);
        this.numbers=numbers
    }
    // 유효성 검증

    private setEmail(email:string): void{
        if(email=== null) throw new InternalServerError(`${__dirname} : profileImage 값이 존재하지 않습니다.`);
        this.email=email
    }
        // 유효성 검증

    public getNumber() {
        return this.numbers;
    }
    
    public getEmail() {
        return this.email;
    }

}