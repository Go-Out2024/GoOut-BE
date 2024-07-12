import { IsNotEmpty } from "class-validator";



export class AlarmTime{

    @IsNotEmpty()
    private alarmStart:string;

    @IsNotEmpty()
    private alarmEnd:string;

    public getAlarmStart(){
        return this.alarmStart;
    }

    public getAlarmEnd(){
        return this.alarmEnd;
    }
}