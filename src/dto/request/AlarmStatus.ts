import { IsEmpty, IsNotEmpty } from "class-validator";


export class AlarmStatus{

    @IsNotEmpty()
    private status: boolean;

    public getStatus(){
        return this.status;
    }
}