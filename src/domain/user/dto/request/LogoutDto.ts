import { IS_ALPHA, IsNotEmpty } from 'class-validator';


export class LogoutDto {
    @IsNotEmpty()
    public refreshToken: string

    @IsNotEmpty()
    public firebaseToken: string

}