
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

    constructor(nickname:string, gender:string, phone: string){
        super();
        this.setNickname(nickname)
        this.setGender(gender)
        this.setPhone(phone)
    }


    @PrimaryGeneratedColumn()
    id: number

    @Column()
    gender:string;

    @Column()
    nickname: string;

    @Column()
    phone:string;



   
    public static createUser(nickname:string, gender:string, phone: string){
        return new User(nickname, gender, phone)

    }

    private setNickname(nickname:string): void{
        if(nickname === null) throw new InternalServerError(`${__dirname} : nickname 값이 존재하지 않습니다.`);
        this.nickname=nickname
    }

    private setGender(gender:string): void{
        if(gender === null) throw new InternalServerError(`${__dirname} : profileImage 값이 존재하지 않습니다.`);
        this.gender=gender
    }

    private setPhone(phone:string): void {
        if(phone === null) throw new InternalServerError(`${__dirname} : phone 값이 존재하지 않습니다.`);
        this.phone=phone
    }

}

