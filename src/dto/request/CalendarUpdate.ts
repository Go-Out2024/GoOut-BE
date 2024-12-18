


import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";










export class CalendarUpdate {

   
    @Type(() => CalendarUpdateContent)
    @IsNotEmpty()
   private calendarContent:CalendarUpdateContent[];

   public getCalendarContent(){
        return this.calendarContent;
   }

}

export class CalendarUpdateContent{

    
    @IsNotEmpty()
    private calendarId:number;

    @IsNotEmpty()
    private content:string;

    @IsNotEmpty()
    private period:number;

    public getCalendarId(){
        return this.calendarId;
    }

    public getContent(){
        return this.content;
    }

    public getPeriod(){
        return this.period;
    }


}