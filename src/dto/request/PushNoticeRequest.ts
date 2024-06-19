import { IsNotEmpty } from "class-validator";


export class PushNoticeRequest{

    @IsNotEmpty()
    private engineValue:string;


    public getEngineValue(){
        return this.engineValue;
    }
}