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
    private period:number;

    constructor(id:number, content:string, kind:string, period:number){
        this.setId(id);
        this.setContent(content);
        this.setKind(kind);
        this.setPeriod(period);
    }

    public static of(id:number, content:string, kind:string, period:number){
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

    private setPeriod(period:number){
        this.period=period;
    }


}