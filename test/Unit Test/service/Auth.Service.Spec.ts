import { AuthService } from '../../../src/service/Auth.Service';
import { UserRepository } from '../../../src/repository/User.Repository';
import { FirebaseTokenRepository } from '../../../src/repository/FirebaseToken.Repository';
import { KakaoApiService } from '../../../src/service/KakaoApi.Service';
import { RedisService } from '../../../src/service/Redis.Service';
import jwt from 'jsonwebtoken';
import { User } from '../../../src/entity/User';

jest.mock('../../../src/repository/User.Repository');
jest.mock('../../../src/repository/FirebaseToken.Repository');
jest.mock('../../../src/service/KakaoApi.Service');
jest.mock('../../../src/service/Redis.Service');
jest.mock('jsonwebtoken');

describe('AuthService Tests', () => {

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    let authService: AuthService;
    const userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    const firebaseTokenRepository = new FirebaseTokenRepository() as jest.Mocked<FirebaseTokenRepository>;
    const kakaoApiService = new KakaoApiService() as jest.Mocked<KakaoApiService>;
    const redisService = new RedisService() as jest.Mocked<RedisService>;

    const userId = 1;
    const accessToken = 'access_token';
    const refreshToken = 'refresh_token';
    const firebaseToken = 'firebase_token';
    const kakaoAccessToken = 'kakao_access_token';

    beforeEach(() => {
        authService = new AuthService(userRepository, firebaseTokenRepository, kakaoApiService, redisService);
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });


    describe('loginWithKakao function test', () => {
        it('basic', async () => {
            const userInfo = { kakaoId: '12345', email: 'test@example.com' };
            const tokens = { accessToken, refreshToken };
            const user = {} as User
            kakaoApiService.bringUserInfo.mockResolvedValue(userInfo);
            userRepository.findByKakaoId.mockResolvedValueOnce({id: userId} as unknown as User); // User found
            (authService as any).generateJwtTokens = jest.fn().mockReturnValue(tokens);
            redisService.penetrateRefreshToken.mockResolvedValueOnce(undefined);

            const result = await authService.loginWithKakao(kakaoAccessToken);

            expect(result).toEqual(tokens);
            expect(kakaoApiService.bringUserInfo).toHaveBeenCalledWith(kakaoAccessToken);
            expect(userRepository.findByKakaoId).toHaveBeenCalledWith(userInfo.kakaoId);
            expect(userRepository.createUser).not.toHaveBeenCalled();
            expect(redisService.penetrateRefreshToken).toHaveBeenCalledWith(tokens.refreshToken, userId);
            expect(redisService.bringRefreshToken).toHaveBeenCalledWith(userId);
        });
    });

        it('should login with kakao and return tokens', async () => {
            const userInfo = { kakaoId: '12345', email: 'test@example.com' };
            const tokens = { accessToken, refreshToken };
            kakaoApiService.bringUserInfo.mockResolvedValue(userInfo);
            userRepository.findByKakaoId.mockResolvedValueOnce(undefined); // User not found, create a new user
            userRepository.createUser.mockResolvedValueOnce({ id: userId } as unknown as User);
            (authService as any).generateJwtTokens = jest.fn().mockReturnValue(tokens);
            redisService.penetrateRefreshToken.mockResolvedValueOnce(undefined);

            const result = await authService.loginWithKakao(kakaoAccessToken);

            expect(result).toEqual(tokens);
            expect(kakaoApiService.bringUserInfo).toHaveBeenCalledWith(kakaoAccessToken);
            expect(userRepository.findByKakaoId).toHaveBeenCalledWith(userInfo.kakaoId);
            expect(userRepository.createUser).toHaveBeenCalledWith({
                numbers: userInfo.kakaoId,
                email: userInfo.email,
            });
            expect(redisService.penetrateRefreshToken).toHaveBeenCalledWith(tokens.refreshToken, userId);
            expect(redisService.bringRefreshToken).toHaveBeenCalledWith(userId);
        });

    describe('logout function test', () => {
        it('basic', async () => {
            const decodedToken = { id: 1 };
            
            jwt.decode = jest.fn().mockReturnValue(decodedToken);
            redisService.eraseRefreshToken.mockResolvedValueOnce(undefined);
            firebaseTokenRepository.deleteTokensByUserId.mockResolvedValueOnce(undefined);

            await authService.logout(refreshToken, firebaseToken);

            expect(jwt.decode).toHaveBeenCalledWith(refreshToken);
            expect(redisService.eraseRefreshToken).toHaveBeenCalledWith(userId);
            expect(firebaseTokenRepository.deleteTokensByUserId).toHaveBeenCalledWith(userId, firebaseToken);
        });

        it('should throw error if token is invalid', async () => {
            jwt.decode = jest.fn().mockReturnValue(null);
            await expect(authService.logout(refreshToken, firebaseToken)).rejects.toThrow('Invalid token');
            expect(jwt.decode).toHaveBeenCalledWith(refreshToken);
            expect(redisService.eraseRefreshToken).not.toHaveBeenCalled();
            expect(firebaseTokenRepository.deleteTokensByUserId).not.toHaveBeenCalled();
        });

        it('should throw error if user ID is not in token', async () => {
            const decodedToken = {};
            jwt.decode = jest.fn().mockReturnValue(decodedToken);
            await expect(authService.logout(refreshToken, firebaseToken)).rejects.toThrow('User ID not found in token');
            expect(jwt.decode).toHaveBeenCalledWith(refreshToken);
            expect(redisService.eraseRefreshToken).not.toHaveBeenCalled();
            expect(firebaseTokenRepository.deleteTokensByUserId).not.toHaveBeenCalled();
        });
    });

    describe('generateJwtTokens function test', () => {
        it('basic', () => {
            const expectedTokens = {
                accessToken: 'access_token',
                refreshToken: 'refresh_token',
            };
            (jwt.sign as jest.Mock)
                .mockReturnValueOnce(expectedTokens.accessToken) // 첫 번째 호출에 accessToken
                .mockReturnValueOnce(expectedTokens.refreshToken); // 두 번째 호출에 refreshToken
            const tokens = authService['generateJwtTokens'](userId);
            expect(jwt.sign).toHaveBeenCalledWith({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d' });
            expect(jwt.sign).toHaveBeenCalledWith({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '2d' });
            expect(tokens).toEqual({ accessToken, refreshToken });
        });
    });
});
