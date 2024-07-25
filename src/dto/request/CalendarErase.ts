import { IsNotEmpty } from "class-validator";



export class CalendarErase{


    @IsNotEmpty()
    private calendarId:number;

    public getCalendarId(){
        return this.calendarId;
    }
}