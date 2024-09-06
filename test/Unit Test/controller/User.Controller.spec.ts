import {UserService} from '../../../src/service/User.Service'
import {UserController} from '../../../src/controller/User.Controller'
import { Request} from 'express';
import { UserNumber } from '../../../src/dto/UserNumber';
import { SuccessResponseDto } from '../../../src/response/SuccessResponseDto';
import { User } from '../../../src/entity/User';

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

    beforeEach(async () => {
        jest.clearAllMocks();
        
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });

    describe('bringUserNumber function test', ()=>{

        const req = {decoded:{id:1}} as Request;

        it('basic', async ()=>{
            const response = await userService.bringUserNumber(req.decoded.id);
            const result = await userController.bringUserNumber(req);
            expect(result).toEqual(SuccessResponseDto.of(response));
        });
    });
});