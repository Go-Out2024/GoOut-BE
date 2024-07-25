

export class CalendarDataCheck{

    private dates:Date[];

    constructor(dates:Date[]){
        this.setDates(dates);
    }

    public static of(dates:Date[]){
        return new CalendarDataCheck(dates);
    }


    private setDates(dates:Date[]){
        this.dates=dates;
    }
}