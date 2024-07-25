import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";


export class CalendarInsert {

    @Type(() => CalendarInsertContent)
    @IsNotEmpty()
   private calendarContent:CalendarInsertContent[];

   public getCalendarContent(){
        return this.calendarContent;
   }

}

class CalendarInsertContent{
    @IsNotEmpty()
    private content:string;

    @IsNotEmpty()
    private kind:string;

    @IsNotEmpty()
    private period:string;

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