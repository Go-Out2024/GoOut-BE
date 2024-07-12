import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User.js';



/**
 * User DAO Class
 */

@EntityRepository(User)
export class UserRepository extends Repository<User> {


    public async findByKakaoId(kakaoId: string): Promise<User | undefined> {
        return this.findOne({ where: {numbers:kakaoId} });
    }

    /** 사용자 정보 생성 및 업데이트 */ 
    public async createUser(userData: {numbers: string, email: string}): Promise<User> {
        const user = this.create(userData);
        return this.save(user);
    }

    /** id(번호)로 사용자 찾기 */
    public async findUserById(id: number): Promise<User | undefined> {
        return await this.findOne({ where: {id} })
    }

    /**
     * 알람 상태를 업데이트 시켜주는 함수
     * @param userId 유저 id
     * @param status 알람 상태 true -> 켜기, false -> 끄기
     * @returns 
     */
    public async updateAlarmStatus(userId: number, status: boolean) {
        return this.createQueryBuilder()
            .update(User)
            .set({ alarm: status }) 
            .where('id = :userId', { userId })
            .execute();
    }

    /**
     * 알림 시작, 종료 시간 업데이트 함수
     * @param userId 유저 id
     * @param alarmStart 알림 시작 시간
     * @param alarmEnd 알림 종료 시간
     * @returns 
     */
    public async updateAlarmTime(userId:number, alarmStart:string, alarmEnd:string){
        return this.createQueryBuilder()
            .update(User)
            .set({alarmStart:alarmStart, alarmEnd:alarmEnd})
            .where('id = :userId',{userId})
            .execute();
    }

    public async deleteUser(userId:number){
        return this.createQueryBuilder()
            .delete()
            .from(User)
            .where('id = :userId',{userId})
            .execute();
    }

 }