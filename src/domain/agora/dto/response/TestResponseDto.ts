import { InternalServerError } from "routing-controllers";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Service } from "typedi";



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export class TestResponseDto {

    private nickname: string;

    private gender: string;

    private phone:string;

    constructor(nickname:string, gender: string, phone:string){
        this.setNickname(nickname)
        this.setGender(gender)
        this.setPhone(phone)
    }

    public static of(nickname:string, gender: string, phone:string): TestResponseDto {

        return new TestResponseDto(nickname, gender, phone);
 
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