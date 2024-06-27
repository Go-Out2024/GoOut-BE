import { IsNotEmpty } from "class-validator";

export class FirebaseTokenDto {
    @IsNotEmpty()
    public token: string
}