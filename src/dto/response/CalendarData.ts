import { Type } from "class-transformer";


export class CalendarDatas{


    @Type(() => CalendarData)
    private calendarDatas:CalendarData[]

    constructor(calendarDatas:CalendarData[]){
        this.setCalendarDatas(calendarDatas);
    }

    public static of(calendarDatas:CalendarData[]){
        return new CalendarDatas(calendarDatas)
    }


    private setCalendarDatas(calendarDatas:CalendarData[]){
        this.calendarDatas=calendarDatas;
    }

}



export class CalendarData{
    private id:number;
    private content:string;
    private kind:string;
    private period:string;

    constructor(id:number, content:string, kind:string, period:string){
        this.setId(id);
        this.setContent(content);
        this.setKind(kind);
        this.setPeriod(period);
    }

    public static of(id:number, content:string, kind:string, period:string){
        return new CalendarData(id, content, kind, period);
    }



    private setId(id:number){
        this.id=id;
    }

    private setContent(content:string){
        this.content=content;
    }

    private setKind(kind:string){
        this.kind=kind;
    }

    private setPeriod(period:string){
        this.period=period;
    }


}