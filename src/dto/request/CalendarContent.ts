import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";


export class CalendarContents {

    @Type(() => CalendarContent)
    @IsNotEmpty()
   private calendarContent:CalendarContent[];

   public getCalendarContent(){
        return this.calendarContent;
   }

}

class CalendarContent{
    @IsNotEmpty()
    private content:string;

    @IsNotEmpty()
    private kind:string;

    @IsNotEmpty()
    private period:number;

    @IsNotEmpty()
    private date:Date;
    

    public getContent(){
        return this.content;
    }

    public getKind(){
        return this.kind;
    }


    public getPeriod(){
        return this.period;
    }

    public getDate(){
        return this.date;
    }
}