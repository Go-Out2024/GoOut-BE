
import { Service } from 'typedi';

import { InjectRepository } from 'typeorm-typedi-extensions';
import { CalendarRepository } from '../repository/Calendar.Repository.js';
import { CalendarContents } from '../dto/request/CalendarContent.js';


@Service()
export class CalendarService { 

    constructor(@InjectRepository() private calendarRepository: CalendarRepository){}

    /**
     * 캘린저 준비물 or 일정 삽입 함수
     * @param calendarContents 캘린더 내용 정보
     */
    async penetrateScheduleOrProduct(calendarContents: CalendarContents, userId:number) {
        await this.calendarRepository.insertCalendarContents(calendarContents, userId);
    }


}