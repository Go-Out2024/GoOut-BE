import {UserService} from '../../../src/service/User.Service'
import {UserController} from '../../../src/controller/User.Controller'
import { Request} from 'express';
import { UserNumber } from '../../../src/dto/UserNumber';
import { SuccessResponseDto } from '../../../src/response/SuccessResponseDto';
import { User } from '../../../src/entity/User';
import { FirebaseTokenDto } from '../../../src/dto/request/FirebaseTokenDto';
import { AlarmStatus } from '../../../src/dto/request/AlarmStatus';
import { AlarmTime } from '../../../src/dto/request/AlarmTime';

declare module 'express-serve-static-core' {
    interface Request {
        decoded: { id: number };
    }
}

jest.mock('../../../src/service/User.Service')

describe('User Controller Test', ()=>{

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    const userService = new UserService({} as any, {} as any) as jest.Mocked<UserService>;
    const userController = new UserController(userService);
    const req = {decoded:{id:1}} as Request;

    beforeEach(async () => {
        jest.clearAllMocks();
        
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });

    describe('bringUserNumber function test', ()=>{

        it('basic', async ()=>{
            const response = await userService.bringUserNumber(req.decoded.id);
            const result = await userController.bringUserNumber(req);
            expect(result).toEqual(SuccessResponseDto.of(response));
        });
    });


    describe('bringUserEmail function test', ()=>{

        it('basic', async ()=>{
            const response = await userService.bringUserEmail(req.decoded.id);
            const result = await userController.bringUserEmail(req);
            expect(result).toEqual(SuccessResponseDto.of(response));
        });
    });

    describe('penetrateFirebaseToken function test', ()=>{

        const penetrateFirebaseTokenRequest = { getToken: jest.fn().mockReturnValue('sdf')} as unknown as FirebaseTokenDto;

        it('basic', async ()=>{
            const response = await userService.penetrateFirebaseToken(req.decoded.id, penetrateFirebaseTokenRequest.getToken());
            const result = await userController.penetrateFirebaseToken(req, penetrateFirebaseTokenRequest);
            expect(result).toEqual(SuccessResponseDto.of(response));
        });
    });


    describe('modifyAlarmOnOff function test', ()=>{

        const alarmStatus = { getStatus: jest.fn().mockReturnValue(true)} as unknown as AlarmStatus;

        it('basic', async ()=>{
            const response = await userService.modifyAlarmOnOff(req.decoded.id, alarmStatus.getStatus());
            const result = await userController.modifyAlarmOnOff(req, alarmStatus);
            expect(result).toEqual(SuccessResponseDto.of(response));
        });
    });

    describe('modifyAlarmTime function test', ()=>{

        const alarmTime = { 
            getAlarmStart: jest.fn().mockReturnValue('12:30'),
            getAlarmEnd: jest.fn().mockReturnValue('17:30')
        } as unknown as AlarmTime;

        it('basic', async ()=>{
            const response = await userService.modifyAlarmTime(req.decoded.id, alarmTime.getAlarmStart(), alarmTime.getAlarmEnd());
            const result = await userController.modifyAlarmTime(req, alarmTime);
            expect(result).toEqual(SuccessResponseDto.of(response));
        });
    });


    describe('eraseUser function test', ()=>{

        it('basic', async ()=>{
            const response = await userService.eraseUser(req.decoded.id);
            const result = await userController.eraseUser(req);
            expect(result).toEqual(SuccessResponseDto.of(response));
        });
    });
});