import { IsNotEmpty } from "class-validator";



export class CalendarErase{


    @IsNotEmpty()
    private calendarIds:number[];

    public getCalendarIds(){
        return this.calendarIds;
    }
}