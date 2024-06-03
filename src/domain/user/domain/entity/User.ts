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
  

    constructor(numbers:string, email:string, firebaseToken?:string){
        super();
        this.setNumber(numbers)
        this.setEmail(email)
        if (firebaseToken) this.setFirebaseToken(firebaseToken);
     
    }



    @PrimaryGeneratedColumn()
    id: number

    @Column()
    numbers:string;

    @Column()
    email: string;

    @Column({ nullable: true })
    firebaseToken: string | null
   
    public static createUser(numbers:string, email:string, firebaseToken?:string){
        return new User(numbers, email, firebaseToken)
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

    private setFirebaseToken(firebaseToken: string): void{
        this.firebaseToken = firebaseToken
    }
        // 유효성 검증

    public getNumber() {
        return this.numbers;
    }
    
    public getEmail() {
        return this.email;
    }

    public getFirebaseToken() {
        return this.firebaseToken
    }
}