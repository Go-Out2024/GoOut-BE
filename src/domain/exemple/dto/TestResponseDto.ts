

export class TestResponseDto {

    constructor(nickname:string, profileImage: string, phone:string){
        this.nickname=nickname;
        this.profileImage=profileImage;
        this.phone=phone;
    }

    private nickname: string;

    private profileImage: string;

    private phone:string;

    public static builder(nickname:string, profileImage: string, phone:string): TestResponseDto {

        return new TestResponseDto(nickname, profileImage, phone);
    
    }
}