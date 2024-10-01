import { TokenService } from '../../../src/service/Token.Service';
import { UserRepository } from '../../../src/repository/User.Repository';
import { FirebaseTokenRepository } from '../../../src/repository/FirebaseToken.Repository';
import jwt from 'jsonwebtoken';
import { User } from '../../../src/entity/User';
import { FirebaseToken } from '../../../src/entity/FirebaseToken';

jest.mock('../../../src/repository/User.Repository');
jest.mock('../../../src/repository/FirebaseToken.Repository');
jest.mock('jsonwebtoken');

describe('TokenService Tests', () => {
    let tokenService: TokenService;
    const userId = 1;
    const refreshToken = 'valid_refresh_token';
    const accessToken = 'new_access_token';

    const mockUser = { id: userId } as unknown as User;

    const userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    const firebaseTokenRepository = new FirebaseTokenRepository() as jest.Mocked<FirebaseTokenRepository>;

    beforeEach(() => {
        tokenService = new TokenService(userRepository, firebaseTokenRepository);
        jest.clearAllMocks();
    });

    describe('verifyRefreshToken function test', () => {
        it('should verify valid refresh token and return new access token', async () => {
            (jwt.verify as jest.Mock).mockReturnValue({ id: userId });
            userRepository.findUserById.mockResolvedValue(mockUser);
            (jwt.sign as jest.Mock).mockReturnValue(accessToken);

            const result = await tokenService.verifyRefreshToken(refreshToken);

            expect(result).toEqual({
                accessToken,
                refreshToken
            });
            expect(jwt.verify).toHaveBeenCalledWith(refreshToken, process.env.JWT_REFRESH_SECRET);
            expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
            expect(jwt.sign).toHaveBeenCalledWith({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d' });
        });

        it('should handle expired refresh token and delete firebase token', async () => {
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new jwt.TokenExpiredError('token expired', new Date());
            });
            const decodedToken = { id: userId };
            (jwt.decode as jest.Mock).mockReturnValue(decodedToken);
            const firebaseToken = 'firebase_token';
            firebaseTokenRepository.findTokenByUserId.mockResolvedValue({ token: firebaseToken } as unknown as FirebaseToken);
            firebaseTokenRepository.deleteTokensByUserId.mockResolvedValue(undefined);

            await expect(tokenService.verifyRefreshToken(refreshToken)).rejects.toThrow('세션이 만료되었습니다. 재로그인 부탁드립니다.');
            expect(firebaseTokenRepository.deleteTokensByUserId).toHaveBeenCalledWith(userId, firebaseToken);
        });

        it('should throw error for invalid token', async () => {
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await expect(tokenService.verifyRefreshToken(refreshToken)).rejects.toThrow('유효하지 않은 토큰입니다. 재로그인 부탁드립니다.');
        });
    });

    describe('bringFirebaseToken function test', () => {
        it('should return firebase token', async () => {
            const tokenData = { token: 'firebase_token' };
            firebaseTokenRepository.findTokenByUserId.mockResolvedValue(tokenData as unknown as FirebaseToken);

            const result = await tokenService['bringFirebaseToken'](userId);

            expect(result).toEqual(tokenData.token);
            expect(firebaseTokenRepository.findTokenByUserId).toHaveBeenCalledWith(userId);
        });

        it('should throw error if firebase token is not found', async () => {
            firebaseTokenRepository.findTokenByUserId.mockResolvedValue(undefined);

            await expect(tokenService['bringFirebaseToken'](userId)).rejects.toThrow('Firebase token not found for user');
            expect(firebaseTokenRepository.findTokenByUserId).toHaveBeenCalledWith(userId);
        });
    });
});
