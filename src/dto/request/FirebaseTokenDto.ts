import { IsNotEmpty } from "class-validator";

export class FirebaseTokenDto {
    @IsNotEmpty()
    private token: string

    public getToken() {
        return this.token
    }
}