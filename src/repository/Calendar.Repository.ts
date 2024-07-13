import { EntityRepository, Repository } from 'typeorm';
import { Calendar } from '../entity/Calendar.js';
import { CalendarContents } from '../dto/request/CalendarContent.js';

@EntityRepository(Calendar)
export class CalendarRepository extends Repository<Calendar> {


    /**
     * 캘린더 정보를 배열로 저장하는 함수
     * @param calendarContents 캘린더 내용 정보
     */
    public async insertCalendarContents(calendarContents: CalendarContents, userId:number){
        const newCalendars = calendarContents.getCalendarContent().map((data)=> 
            Calendar.createCalendar(data.getContent(), data.getPeriod(), data.getKind(), data.getDate(), userId));
        await this.save(newCalendars);
    }

 
}