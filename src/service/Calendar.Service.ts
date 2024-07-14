
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CalendarRepository } from '../repository/Calendar.Repository.js';
import { CalendarInsert } from '../dto/request/CalendarInsert.js';
import { Calendar } from '../entity/Calendar.js';
import { checkData } from '../util/checker.js';
import { ErrorResponseDto } from '../response/ErrorResponseDto.js';
import { ErrorCode } from '../exception/ErrorCode.js';
import { CalendarUpdate } from '../dto/request/CalendarUpdate.js';


@Service()
export class CalendarService { 

    constructor(@InjectRepository() private calendarRepository: CalendarRepository){}

    /**
     * 캘린저 준비물 or 일정 삽입 함수
     * @param calendarContents 캘린더 내용 정보
     */
    async penetrateScheduleOrProduct(calendarContents: CalendarInsert, userId:number) {
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


    /**
     * 캘린더 수정 함수
     * @param calendarUpdate 캘린더 수정 dto
     * @param userId 유저 id
     */
    async modifyScheduleOrProduct(calendarUpdate: CalendarUpdate, userId:number) {
        const calendarData = await this.calendarRepository.findCalendarByIdAndUserId(calendarUpdate.getCalendarId(), userId);
        this.verifyCalendar(calendarData);
        await this.calendarRepository.updateCalendar(calendarUpdate, userId);
    }


    /**
     * 캘린더 데이터 검증 함수
     * @param calendar 검증할 캘린더 엔티티 데이터
     */
    public verifyCalendar(calendar:Calendar){
        if(!checkData(calendar))
            throw ErrorResponseDto.of(ErrorCode.NOT_FOUNT_CALENDAR);
    }


}