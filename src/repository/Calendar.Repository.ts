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


    /**
     * 캘린더id와 유저 id를 활용한 특정 Calendar 엔티티 조회 함수 
     * @param calendarId 캘린더 id
     * @param userId 유저 id
     * @returns Calendar 엔티티
     */
    public async findCalendarByIdAndUserId(calendarId:number, userId:number){
        return this.createQueryBuilder()
            .select('c')
            .from(Calendar, 'c')
            .where('c.id = :calendarId',{calendarId})
            .andWhere('c.user_id = :userId',{userId})
            .getOne();
    }

    /**
     * 캘린더id와 유저 id를 활용한 특정 Calendar 엔티티 삭제 함수
     * @param calendarId 캘린더 id
     * @param userId 유저 id
     * @returns 
     */
    public async deleteCalendar(calendarId:number, userId:number){
        return this.createQueryBuilder()
            .delete()
            .from(Calendar)
            .where('id = :calendarId',{calendarId})
            .andWhere('user_id = :userId',{userId})
            .execute();
    }

 
}