
import { IsNotEmpty, Length, Max } from 'class-validator';




export class TestRequestDto {

    @IsNotEmpty({ message: 'EMPTY' })
    @Length(5, 50, { message: 'SO_LONG' })
    private nickname: string;


    @IsNotEmpty({ message: 'EMPTY' })
    private profileImage: string;

    @IsNotEmpty({ message: 'EMPTY' })
    private phone:string;

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