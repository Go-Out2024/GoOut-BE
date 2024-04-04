
import { IsNotEmpty, Length, Max } from 'class-validator';




export class TestRequestDto {

    @IsNotEmpty()
    @Length(2, 8)
    public nickname: string;


    @IsNotEmpty()
    public gender: string;

    @IsNotEmpty()
    public phone:string;

    public getNickname(){
        return this.nickname;
    }

    public getGender(){
        return this.gender;
    }

    public getPhone(){
        return this.phone;
    }





}