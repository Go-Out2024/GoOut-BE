import { AuthController } from '../../../src/controller/Auth.Controller';
import { AuthService } from '../../../src/service/Auth.Service';
import { Request, Response } from 'express';
import { SuccessResponseDto } from '../../../src/response/SuccessResponseDto';
import { ErrorHandler } from '../../../src/exception/ErrorHandler';
import { LogoutDto } from '../../../src/dto/request/LogoutDto';

jest.mock('../../../src/service/Auth.Service');
jest.mock('../../../src/exception/ErrorHandler');

describe('Auth Controller Test', () => {
    
    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    const authService = new AuthService({} as any, {} as any, {} as any, {} as any) as jest.Mocked<AuthService>;
    const errorHandler = new ErrorHandler() as jest.Mocked<ErrorHandler>;
    const authController = new AuthController(authService, errorHandler);

    const req = {
        headers: {
            authorization: 'Bearer mockAccessToken',
        },
    } as Partial<Request>;

    const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
    } as Partial<Response>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('login function test', () => {
        it('should successfully login and return tokens', async () => {
            const mockTokens = { accessToken: {} as never, refreshToken: {} as never};
            authService.loginWithKakao.mockResolvedValue(mockTokens);
            await authController.login(req as Request, res as Response);
            expect(authService.loginWithKakao).toHaveBeenCalledWith('Bearer mockAccessToken');
            expect(res.send).toHaveBeenCalledWith(SuccessResponseDto.of(mockTokens));
        });
    });

    describe('logout function test', () => {
        it('should successfully logout', async () => {
            const logoutDto: LogoutDto = { refreshToken: 'refreshToken', firebaseToken: 'firebaseToken' };
            await authController.logout(logoutDto, res as Response);
            expect(authService.logout).toHaveBeenCalledWith('refreshToken', 'firebaseToken');
            expect(res.send).toHaveBeenCalledWith({ message: '로그아웃이 완료되었습니다.' });
        });
    });
});
