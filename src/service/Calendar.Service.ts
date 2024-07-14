
import { Service } from 'typedi';

import { InjectRepository } from 'typeorm-typedi-extensions';
import { CalendarRepository } from '../repository/Calendar.Repository.js';
import { CalendarContents } from '../dto/request/CalendarContent.js';
import { Calendar } from '../entity/Calendar.js';
import { checkData } from '../util/checker.js';
import { ErrorResponseDto } from '../response/ErrorResponseDto.js';
import { ErrorCode } from '../exception/ErrorCode.js';


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


    /**
     * 캘린더 데이터 삭제 함수
     * @param userId 유저 id
     * @param calendarId 캘린더 id
     */
    async eraseScheduleOrProduct(userId:number, calendarId:number) {
        const calendarData = await this.calendarRepository.findCalendarByIdAndUserId(calendarId, userId);
        this.verifyCalendar(calendarData);
        await this.calendarRepository.deleteCalendar(calendarId, userId);
    }



    public verifyCalendar(calendar:Calendar){
        if(!checkData(calendar))
            throw ErrorResponseDto.of(ErrorCode.NOT_FOUNT_CALENDAR);
    }


}