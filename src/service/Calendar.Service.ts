
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CalendarRepository } from '../repository/Calendar.Repository.js';
import { CalendarInsert } from '../dto/request/CalendarInsert.js';
import { Calendar } from '../entity/Calendar.js';
import { checkData } from '../util/checker.js';
import { ErrorResponseDto } from '../response/ErrorResponseDto.js';
import { ErrorCode } from '../exception/ErrorCode.js';
import { CalendarUpdate } from '../dto/request/CalendarUpdate.js';
import { CalendarDataCheck } from '../dto/response/CalendarDataCheck.js';
import { CalendarData, CalendarDatas } from '../dto/response/CalendarData.js';


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
     * 유저, 날짜에 따른 일정 or 준비물 조회 함수
     * @param userId 유저 id
     * @param date 조회할 날짜
     * @returns 
     */
    async bringScheduleOrProduct(userId:number, date:string):Promise<CalendarDatas>{
        const calendars = await this.calendarRepository.findCalendarsByUserId(userId);
        const filteredCalendars = this.filterCalendarsByPeriodMultiple(calendars, date);
        return CalendarDatas.of(this.mappingCalendarData(filteredCalendars));
  
    }

    public mappingCalendarData(calendars: Calendar[]){
        return calendars.map((calendar)=>{
            return CalendarData.of(calendar.getId(), calendar.getContent(), calendar.getKind(), calendar.getPeriod());
        })
    }


    public filterCalendarsByPeriodMultiple(calendars: Calendar[], date:string){
        const result = calendars.filter(calendar => {
            const startDate = new Date(calendar.getDate());
            const targetDate = new Date(date);
            // 주기를 밀리초 단위로 변환 (일 단위)
            const frequencyInMs = calendar.getPeriod() * 24 * 60 * 60 * 1000;
            // 시작 날짜와 조회 날짜의 시간 차이를 계산
            const timeDiff = targetDate.getTime() - startDate.getTime();
            // 시간 차이가 주기의 배수인지 확인하여 해당 날짜에 물품이 있는지 판단
            return timeDiff >= 0 && timeDiff % frequencyInMs === 0;
        });
        // 필터링된 물품 리스트 반환
        return result;
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
     * 해당 달에 있는 일정 or 준비물 날짜 조회 함수
     * @param userId 유저 id
     * @param month 조회할 달 ex) 2024-03
     * @returns 일정 or 준비물 날짜
     */
    async bringScheduleOrProductChecking(userId:number, month:string):Promise<CalendarDataCheck>{
        const calendars = await this.calendarRepository.findCalendarsByUserId(userId);
        const dates = this.extractCalendarChecking(calendars, month);
        return CalendarDataCheck.of(dates);
    }


    /**
     * 조회할 달에 체킹되어야할 날짜들 조회 함수
     * @param calendars 캘린더 
     * @param month 조회할 달
     * @returns 조회달의 체킹되야할 날짜 
     */
    public extractCalendarChecking(calendars: Calendar[], month:string){
        const [monthStartDate, monthEndDate] = this.getMonthEndDate(month);
        const uniqueDates = this.extractDates(calendars, monthStartDate, monthEndDate);
        return Array.from(uniqueDates).map(time => new Date(time)).sort((a, b) => a.getTime() - b.getTime());
    }


    /**
     * 캘린더별 시간 날짜와 종료날짜 사이의 조건 충족 날짜 추출함수
     * @param calendars 캘린더 데이터
     * @param monthStartDate 시작 날짜
     * @param monthEndDate 종료 날짜
     * @returns 조건 충족 날짜
     */
    public extractDates(calendars: Calendar[], monthStartDate:Date, monthEndDate:Date){
        const uniqueDates = new Set<number>();
        calendars.forEach(calendar => {
            const frequencyInMs = calendar.getPeriod() * 24 * 60 * 60 * 1000;
            let currentDate = new Date(calendar.getDate());
            if (calendar.getPeriod() === 0) {
                if (currentDate >= monthStartDate && currentDate <= monthEndDate) {
                    uniqueDates.add(currentDate.getTime());
                }
            } else {
                while (currentDate <= monthEndDate) {
                    if (currentDate >= monthStartDate && currentDate <= monthEndDate) {
                        if (!uniqueDates.has(currentDate.getTime())) {
                            uniqueDates.add(currentDate.getTime());
                        }
                    }
                    currentDate = new Date(currentDate.getTime() + frequencyInMs);
                }
            }
        });
        return uniqueDates;
    }

    /**
     * 해당 달의 시작날짜와 종료 날짜 조회
     * @param month 조회할 달 ex) 2024-01
     * @returns 시작 날짜, 종료 날짜
     */
    public getMonthEndDate(month: string): [Date, Date]{
        const [year, monthIndex] = month.split('-').map(Number);
        const startDate = new Date(Date.UTC(year, monthIndex - 1, 1));
        const endDate = new Date(Date.UTC(year, monthIndex, 0)); 
        return [startDate, endDate];
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