
import { IsNotEmpty, Length, Max } from 'class-validator';




export class TestRequestDto {

    @IsNotEmpty({ message: 'EMPTY' })
    @Length(5, 50, { message: 'SO_LONG' })
    public nickname: string;


    @IsNotEmpty({ message: 'EMPTY' })
    public profileImage: string;

    @IsNotEmpty({ message: 'EMPTY' })
    public phone:string;

    public getNickname(){
        return this.nickname;
    }

    public getProfileImage(){
        return this.profileImage;
    }

    public getPhone(){
        return this.phone;
    }





}