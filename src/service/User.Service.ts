import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { UserRepository } from "../repository/User.Repository";
import { User } from "../entity/User";
import { UserNumber } from "../dto/UserNumber";
import { UserEmail } from "../dto/UserEmail";
import { FirebaseTokenRepository } from "../repository/FirebaseToken.Repository";
import { verifyUser } from "../util/verify";
import { Alarm } from "../dto/response/Alarm";

@Service()
export class UserService {
  constructor(
    @InjectRepository() private userRepository: UserRepository,
    @InjectRepository() private firebaseTokenRepository: FirebaseTokenRepository
  ) {}

  /**
   * 유저 번호 조회 응용 서비스 함수
   * @param userId 유저 고유 번호
   * @returns
   */
  public async bringUserNumber(userId: number): Promise<UserNumber> {
    const userData: User = await this.userRepository.findUserById(userId);
    verifyUser(userData);
    return UserNumber.of(userData);
  }

  /**
   * 유저가 세팅한 알림 시간을 조회하는 함수
   * @param userId 유저 id
   * @returns
   */
  public async bringAlarmTime(userId: number): Promise<Alarm> {
    const userData: User = await this.userRepository.findUserById(userId);
    return Alarm.of(null, userData.getStartTime(), userData.getEndTime());
  }

  /**
   * 유저 이메일 조회 응용 서비스 함수
   * @param userId 유저 고유 번호
   * @returns
   */
  public async bringUserEmail(userId: number): Promise<UserEmail> {
    const userData: User = await this.userRepository.findUserById(userId);
    verifyUser(userData);
    return UserEmail.of(userData);
  }

  /**
   * 유저 알림 상태 조회 함수
   * @param userId 유저 id
   * @returns
   */
  public async bringAlarmStatus(userId: number): Promise<Alarm> {
    const userData = await this.userRepository.findUserById(userId);
    return Alarm.of(userData.getAlarm());
  }

  public async penetrateFirebaseToken(userId: number,token: string) {
    const user = await this.userRepository.findUserById(userId);
    verifyUser(user);
    const existingToken = await this.firebaseTokenRepository.findTokenByUserIdAndToken(userId, token);
    if(!existingToken){
      await this.firebaseTokenRepository.insertToken(user, token);
    }
  }

  /**
   * 알림 상태 변경 함수
   * @param userId 유저 id
   * @param status 알림 상태 true -> 켜기, false -> 끄기
   */
  public async modifyAlarmOnOff(userId: number, status: boolean) {
    const user = await this.userRepository.findUserById(userId);
    verifyUser(user);
    await this.userRepository.updateAlarmStatus(userId, status);
  }

  /**
   * 알림 시간 설정 함수
   * @param userId 유저 id
   * @param alarmStart 알림 시작 시간
   * @param alarmEnd 알림 종료 시간
   */
  public async modifyAlarmTime(
    userId: number,
    alarmStart: string,
    alarmEnd: string
  ) {
    const user = await this.userRepository.findUserById(userId);
    verifyUser(user);
    await this.userRepository.updateAlarmTime(userId, alarmStart, alarmEnd);
  }

  /**
   * 유저 삭제 함수
   * @param userId 유저 id
   */
  public async eraseUser(userId: number) {
    const user = await this.userRepository.findUserById(userId);
    verifyUser(user);
    await this.userRepository.deleteUser(userId);
  }
}
