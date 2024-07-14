


import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";


export class CalendarUpdate {

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

//     @Type(() => CalendarUpdateContent)
//     @IsNotEmpty()
//    private calendarContent:CalendarUpdateContent[];

//    public getCalendarContent(){
//         return this.calendarContent;
//    }

}

class CalendarUpdateContent{

    
    // @IsNotEmpty()
    // private calendarId:number;

    // @IsNotEmpty()
    // private content:string;

    // @IsNotEmpty()
    // private period:number;

    // public getCalendarId(){
    //     return this.calendarId;
    // }

    // public getContent(){
    //     return this.content;
    // }

    // public getPeriod(){
    //     return this.period;
    // }


}