import { BaseEntity } from "../../../../global/entitiy/BaseEntity.js"
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
} from "typeorm"
import { InternalServerError } from "routing-controllers";


@Entity("User")
export class User extends BaseEntity{
  

    constructor(nickname:string, email:string, phone: string){
        super();
        this.setNumber(nickname)
        this.setEmail(email)
     
    }


    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true})
    number:string;

    @Column()
    email: string;

   
    public static createUser(nickname:string, gender:string, phone: string){
        return new User(nickname, gender, phone)
    }
    // 외부에서 쉽게 'User' 인스턴스 생성 가능

    private setNumber(number:string): void{
        if(number === null) throw new InternalServerError(`${__dirname} : nickname 값이 존재하지 않습니다.`);
        this.number=number
    }
    // 유효성 검증

    private setEmail(email:string): void{
        if(email=== null) throw new InternalServerError(`${__dirname} : profileImage 값이 존재하지 않습니다.`);
        this.email=email
    }
    // 유효성 검증

    public getNumber() {
        return this.number;
    }
    
    public getEmail() {
        return this.email;
    }
}