import {
  JsonController,
  Get,
  HttpCode,
  Param,
  Body,
  Res,
  Req,
  UseBefore,
  Post,
  Patch,
  Delete,
} from "routing-controllers";
import { Service, Token } from "typedi";
import { SuccessResponseDto } from "../response/SuccessResponseDto";
import { compareAuthToken } from "../middleware/jwtMiddleware";
import { Request } from "express";
import { UserService } from "../service/User.Service";
import { UserNumber } from "../dto/UserNumber";
import { UserEmail } from "../dto/UserEmail";
import { FirebaseTokenDto } from "../dto/request/FirebaseTokenDto";
import { AlarmStatus } from "../dto/request/AlarmStatus";
import { AlarmTime } from "../dto/request/AlarmTime";
import { Alarm } from "../dto/response/Alarm";

@JsonController("/user")
@Service()
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * 유저 번호를 조회 함수
   * @param req
   * @returns
   */
  @HttpCode(200)
  @Get("/number")
  @UseBefore(compareAuthToken)
  public async bringUserNumber(
    @Req() req: Request
  ): Promise<SuccessResponseDto<UserNumber>> {
    const result = await this.userService.bringUserNumber(req.decoded.id);
    return SuccessResponseDto.of(result);
  }

  /**
   * 유저 이메일 조회 함수
   * @param req
   * @returns
   */
  @HttpCode(200)
  @Get("/email")
  @UseBefore(compareAuthToken)
  public async bringUserEmail(
    @Req() req: Request
  ): Promise<SuccessResponseDto<UserEmail>> {
    const result = await this.userService.bringUserEmail(req.decoded.id);
    return SuccessResponseDto.of(result);
  }

  /**
   * 유저 알림 상태 조회 함수
   * @param req
   */
  @HttpCode(200)
  @Get("/alarm")
  @UseBefore(compareAuthToken)
  public async bringAlarmStatus(
    @Req() req: Request
  ): Promise<SuccessResponseDto<Alarm>> {
    const result = await this.userService.bringAlarmStatus(req.decoded.id);
    return SuccessResponseDto.of(result);
  }

  /**
   * 유저 알림 시간 조회 함수
   * @param req
   */
  @HttpCode(200)
  @Get("/alarm/time")
  @UseBefore(compareAuthToken)
  public async bringAlarmTime(
    @Req() req: Request
  ): Promise<SuccessResponseDto<Alarm>> {
    const result = await this.userService.bringAlarmTime(req.decoded.id);
    return SuccessResponseDto.of(result);
  }

  /**
   * 유저 파이어베이스를 저장하는 함수
   * @param req
   * @param penetrateFirebaseTokenRequest 파이어베이스 저장 dto
   * @returns
   */
  @HttpCode(200)
  @Post("/firebase-token")
  @UseBefore(compareAuthToken)
  public async penetrateFirebaseToken(
    @Req() req: Request,
    @Body() penetrateFirebaseTokenRequest: FirebaseTokenDto
  ): Promise<SuccessResponseDto<void>> {
    await this.userService.penetrateFirebaseToken(
      req.decoded.id,
      penetrateFirebaseTokenRequest.getToken()
    );
    return SuccessResponseDto.of();
  }

  /**
   * 알림 상태 설정 함수
   * @param req
   * @param alarmStatus 알림 상태 true -> 켜기, false -> 끄기
   * @returns
   */
  @HttpCode(200)
  @Patch("/alarm")
  @UseBefore(compareAuthToken)
  public async modifyAlarmOnOff(
    @Req() req: Request,
    @Body() alarmStatus: AlarmStatus
  ): Promise<SuccessResponseDto<void>> {
    await this.userService.modifyAlarmOnOff(
      req.decoded.id,
      alarmStatus.getStatus()
    );
    console.log("유저 알림 상태 업데이트 완료");
    return SuccessResponseDto.of();
  }

  /**
   * 알림 시간 설정 함수
   * @param req
   * @param alarmTime 알림 시간 -> 시작, 종료
   * @returns
   */
  @HttpCode(200)
  @Patch("/alarm/time")
  @UseBefore(compareAuthToken)
  public async modifyAlarmTime(
    @Req() req: Request,
    @Body() alarmTime: AlarmTime
  ): Promise<SuccessResponseDto<void>> {
    await this.userService.modifyAlarmTime(
      req.decoded.id,
      alarmTime.getAlarmStart(),
      alarmTime.getAlarmEnd()
    );
    console.log("유저 알림 시간 업데이트 완료");
    return SuccessResponseDto.of();
  }

  @HttpCode(200)
  @Delete()
  @UseBefore(compareAuthToken)
  public async eraseUser(
    @Req() req: Request
  ): Promise<SuccessResponseDto<void>> {
    await this.userService.eraseUser(req.decoded.id);
    console.log("유저 계정 삭제 완료");
    return SuccessResponseDto.of();
  }
}
