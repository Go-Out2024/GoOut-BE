
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CalendarRepository } from '../repository/Calendar.Repository';
import { CalendarInsert } from '../dto/request/CalendarInsert';
import { Calendar } from '../entity/Calendar';
import { CalendarUpdate } from '../dto/request/CalendarUpdate';
import { CalendarDataCheck } from '../dto/response/CalendarDataCheck';
import { CalendarData, CalendarDatas } from '../dto/response/CalendarData';
import { getPeriodKey } from '../util/enum/Period';
import { verifyCalendars, verifyUser } from '../util/verify';
import { UserRepository } from '../repository/User.Repository';



@Service()
export class CalendarService { 

    constructor(
        @InjectRepository() private calendarRepository: CalendarRepository,
        @InjectRepository() private userRepository: UserRepository
    ){}

    /**
     * 캘린저 준비물 or 일정 삽입 함수
     * @param calendarContents 캘린더 내용 정보
     */
    async penetrateScheduleOrProduct(calendarContents: CalendarInsert, userId:number) {
        const user = await this.userRepository.findUserById(userId);
        verifyUser(user);
        await this.calendarRepository.insertCalendarContents(calendarContents, userId);
    }


    /**
     * 캘린더 데이터 삭제 함수
     * @param userId 유저 id
     * @param calendarId 캘린더 id
     */
    async eraseScheduleOrProduct(userId:number, calendarIds:number[]) {
        const calendarDatas = await this.calendarRepository.findCalendarsByIdAndUserId(calendarIds, userId);
        verifyCalendars(calendarDatas, calendarIds.length);
        await this.calendarRepository.deleteCalendar(calendarIds, userId);
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


    /**
     * 캘린더 엔티티를 CalendarData로 매핑하는 함수
     * @param calendars 캘린더 엔티티
     * @returns 
     */
    public mappingCalendarData(calendars: Calendar[]){
        return calendars.map((calendar)=>{
            return CalendarData.of(calendar.getId(), calendar.getContent(), calendar.getKind(), getPeriodKey(calendar.getPeriod()));
        })
    }


    /**
     * 각 캘린더 데이터 주기에 따라 기준 날짜의 배수 날짜인지 구분해주는 필터 함수
     * @param calendars 다중 캘린더 엔티티 데이터
     * @param date 기준 날짜
     * @returns 
     */
    public filterCalendarsByPeriodMultiple(calendars: Calendar[], date:string){
        const result = calendars.filter(calendar => {
            const startDate = new Date(calendar.getDate());
            const targetDate = new Date(date);
            const frequencyInMs = calendar.getPeriod() * 24 * 60 * 60 * 1000;
            const timeDiff = targetDate.getTime() - startDate.getTime();
            return timeDiff >= 0 && timeDiff % frequencyInMs === 0;
        });
        return result;
    }



    /**
     * 캘린더 수정 함수
     * @param calendarUpdate 캘린더 수정 dto
     * @param userId 유저 id
     */
    async modifyScheduleOrProduct(calendarUpdate: CalendarUpdate, userId:number) {
        const calendarIds = this.extractCalendarId(calendarUpdate);
        const calendarDatas = await this.calendarRepository.findCalendarsByIdAndUserId(calendarIds, userId);
        verifyCalendars(calendarDatas, calendarUpdate.getCalendarContent().length);
        const mappedCalendarUpdateStatus = this.mappingCalendarUpdateStatus(calendarUpdate, userId);
        await this.calendarRepository.updateCalendar(mappedCalendarUpdateStatus);
    }

  
    /**
     * 업데이트할 캘린더 데이터를 엔티티 변환 함수
     * @param calendarUpdate 업데이트할 캘린더 데이터
     * @param userId 유저 id
     * @returns 
     */
    private mappingCalendarUpdateStatus(calendarUpdate: CalendarUpdate, userId:number){
        return calendarUpdate.getCalendarContent().map(update => {
            return Calendar.createCalendarUpdate(update.getCalendarId(), update.getContent(), update.getPeriod(), userId)
        });
    }


    /**
     * 캘린더 id 추출 함수
     * @param calendarUpdate 업데이트할 캘린더 데이터
     * @returns 
     */
    private extractCalendarId(calendarUpdate: CalendarUpdate){
        return calendarUpdate.getCalendarContent().map((data)=> data.getCalendarId());
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
    public extractDates(calendars: Calendar[], monthStartDate: Date, monthEndDate: Date): Set<number> {
        const uniqueDates = new Set<number>();
        calendars.forEach(calendar => {
            this.processCalendarDates(calendar, monthStartDate, monthEndDate, uniqueDates);
        });
        return uniqueDates;
    }
    

    /**
     * 캘린더 데이터 조건 충족 날짜 실행 함수
     * @param calendars 캘린더 데이터
     * @param monthStartDate 시작 날짜
     * @param monthEndDate 종료 날짜
     * @param uniqueDates 데이터를 담을 날짜
     */
    private processCalendarDates(calendar: Calendar, monthStartDate: Date, monthEndDate: Date, uniqueDates: Set<number>) {
        const frequencyInMs = this.getFrequencyInMs(calendar);
        let currentDate = new Date(calendar.getDate());
        if (calendar.getPeriod() === 0) {
            this.addSingleDateIfWithinRange(currentDate, monthStartDate, monthEndDate, uniqueDates);
        } else {
            this.addRecurringDates(currentDate, frequencyInMs, monthStartDate, monthEndDate, uniqueDates);
        }
    }
    
    /**
     * 밀리 단위 변환 함수
     * @param calendar 캘린더 엔티티
     * @returns 
     */
    private getFrequencyInMs(calendar: Calendar): number {
        return calendar.getPeriod() * 24 * 60 * 60 * 1000; 
    }
    
    /**
     * 주기가 없는 날짜 로직 처리 함수
     * @param calendars 캘린더 데이터
     * @param monthStartDate 시작 날짜
     * @param monthEndDate 종료 날짜
     * @param uniqueDates 데이터를 담을 날짜
     */
    private addSingleDateIfWithinRange(currentDate: Date, monthStartDate: Date, monthEndDate: Date, uniqueDates: Set<number>) {
        if (currentDate >= monthStartDate && currentDate <= monthEndDate) {
            uniqueDates.add(currentDate.getTime());
        }
    }
    

    /**
     * 주기가 있는 날자 로직 처리 함수
     * @param currentDate 현재 날짜
     * @param calendars 캘린더 데이터
     * @param monthStartDate 시작 날짜
     * @param monthEndDate 종료 날짜
     * @param uniqueDates 데이터를 담을 날짜
     */
    private addRecurringDates(currentDate: Date, frequencyInMs: number, monthStartDate: Date, monthEndDate: Date, uniqueDates: Set<number>) {
        while (currentDate <= monthEndDate) {
            if (currentDate >= monthStartDate && currentDate <= monthEndDate) {
                uniqueDates.add(currentDate.getTime());
            }
            currentDate = new Date(currentDate.getTime() + frequencyInMs);
        }
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




    


}