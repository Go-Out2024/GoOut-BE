import { InternalServerError } from "routing-controllers";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export class TestResponseDto {

    private nickname: string;

    private profileImage: string;

    private phone:string;

    constructor(nickname:string, profileImage: string, phone:string){
        this.setNickname(nickname)
        this.setProfileImage(profileImage)
        this.setPhone(phone)
    }

    public static of(nickname:string, profileImage: string, phone:string): TestResponseDto {

        return new TestResponseDto(nickname, profileImage, phone);
 
    }

    private setNickname(nickname:string): void{
        if(nickname === null) throw new InternalServerError(`${__dirname} : nickname 값이 존재하지 않습니다.`);
        this.nickname=nickname
    }

    private setProfileImage(profileImage:string): void{
        if(profileImage === null) throw new InternalServerError(`${__dirname} : profileImage 값이 존재하지 않습니다.`);
        this.profileImage=profileImage
    }

    private setPhone(phone:string): void {
        if(phone === null) throw new InternalServerError(`${__dirname} : phone 값이 존재하지 않습니다.`);
        this.phone=phone
    }
}