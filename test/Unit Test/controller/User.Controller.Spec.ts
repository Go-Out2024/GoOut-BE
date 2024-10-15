import { UserService } from "../../../src/service/User.Service";
import { UserController } from "../../../src/controller/User.Controller";
import { Request } from "express";
import { UserNumber } from "../../../src/dto/UserNumber";
import { SuccessResponseDto } from "../../../src/response/SuccessResponseDto";
import { User } from "../../../src/entity/User";
import { FirebaseTokenDto } from "../../../src/dto/request/FirebaseTokenDto";
import { AlarmStatus } from "../../../src/dto/request/AlarmStatus";
import { AlarmTime } from "../../../src/dto/request/AlarmTime";
import { UserEmail } from "../../../src/dto/UserEmail";
import { Alarm } from "../../../src/dto/response/Alarm";

declare module "express-serve-static-core" {
  interface Request {
    decoded: { id: number };
  }
}

jest.mock("../../../src/service/User.Service");

describe("User Controller Test", () => {
  beforeAll(async () => {});

  afterAll(async () => {});

  const userService = new UserService(
    {} as any,
    {} as any
  ) as jest.Mocked<UserService>;
  const userController = new UserController(userService);
  const req = { decoded: { id: 1 } } as Request;

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  describe("bringUserNumber function test", () => {
    it("basic", async () => {
      const bringUserNumberResponse = UserNumber.of({
        getNumber: jest.fn().mockReturnValue(12),
      } as unknown as User);
      userService.bringUserNumber.mockResolvedValue(bringUserNumberResponse);
      const result = await userController.bringUserNumber(req);
      expect(result).toEqual(SuccessResponseDto.of(bringUserNumberResponse));
      expect(userService.bringUserNumber).toHaveBeenCalledWith(req.decoded.id);
    });
  });

  describe("bringUserEmail function test", () => {
    it("basic", async () => {
      const bringUserEmailResponse = UserEmail.of({
        getEmail: jest.fn().mockReturnValue("11@naver.com"),
      } as unknown as User);
      userService.bringUserEmail.mockResolvedValue(bringUserEmailResponse);
      const result = await userController.bringUserEmail(req);
      expect(result).toEqual(SuccessResponseDto.of(bringUserEmailResponse));
      expect(userService.bringUserEmail).toHaveBeenCalledWith(req.decoded.id);
    });
  });

  describe("penetrateFirebaseToken function test", () => {
    const penetrateFirebaseTokenRequest = {
      getToken: jest.fn().mockReturnValue("sdf"),
    } as unknown as FirebaseTokenDto;

    it("basic", async () => {
      userService.penetrateFirebaseToken.mockResolvedValue(undefined);
      const result = await userController.penetrateFirebaseToken(
        req,
        penetrateFirebaseTokenRequest
      );
      expect(result).toEqual(SuccessResponseDto.of(undefined));
      expect(userService.penetrateFirebaseToken).toHaveBeenCalledWith(
        req.decoded.id,
        penetrateFirebaseTokenRequest.getToken()
      );
    });
  });

  describe("modifyAlarmOnOff function test", () => {
    const alarmStatus = {
      getStatus: jest.fn().mockReturnValue(true),
    } as unknown as AlarmStatus;

    it("basic", async () => {
      userService.modifyAlarmOnOff.mockResolvedValue(undefined);
      const result = await userController.modifyAlarmOnOff(req, alarmStatus);
      expect(result).toEqual(SuccessResponseDto.of(undefined));
      expect(userService.modifyAlarmOnOff).toHaveBeenCalledWith(
        req.decoded.id,
        alarmStatus.getStatus()
      );
    });
  });

  describe("modifyAlarmTime function test", () => {
    const alarmTime = {
      getAlarmStart: jest.fn().mockReturnValue("12:30"),
      getAlarmEnd: jest.fn().mockReturnValue("17:30"),
    } as unknown as AlarmTime;

    it("basic", async () => {
      userService.modifyAlarmTime.mockResolvedValue(undefined);
      const result = await userController.modifyAlarmTime(req, alarmTime);
      expect(result).toEqual(SuccessResponseDto.of(undefined));
      expect(userService.modifyAlarmTime).toHaveBeenCalledWith(
        req.decoded.id,
        alarmTime.getAlarmStart(),
        alarmTime.getAlarmEnd()
      );
    });
  });

  describe("eraseUser function test", () => {
    it("basic", async () => {
      userService.eraseUser.mockResolvedValue(undefined);
      const result = await userController.eraseUser(req);
      expect(result).toEqual(SuccessResponseDto.of(undefined));
      expect(userService.eraseUser).toHaveBeenCalledWith(req.decoded.id);
    });
  });

  describe("bringAlarmStatus function test", () => {
    const response = Alarm.of(true);

    it("basic", async () => {
      userService.bringAlarmStatus.mockResolvedValue(response);
      const result = await userController.bringAlarmStatus(req);
      expect(result).toEqual(SuccessResponseDto.of(response));
      expect(userService.bringAlarmStatus).toHaveBeenCalledWith(req.decoded.id);
    });
  });
});
