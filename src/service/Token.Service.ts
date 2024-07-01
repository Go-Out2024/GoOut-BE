import { Service } from "typedi";
import jwt from 'jsonwebtoken'
import { UserRepository } from "../repository/User.Repository.js";
import { InjectRepository } from 'typeorm-typedi-extensions';
import { RedisService } from "./Redis.Service.js";
import { FirebaseTokenRepository } from "../repository/FirebaseToken.Repository.js";

@Service()
export class TokenService {
    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository,
        @InjectRepository(FirebaseTokenRepository) private firebaseTokenRepository: FirebaseTokenRepository,
        private redisService: RedisService
    ) {}

    async verifyRefreshToken(refreshToken: string) {
        try {
            const payload: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = await this.userRepository.findUserById(payload.id);
            if (!user) {
                throw new Error('사용자를 찾지 못했습니다. ');
            }

            // 새로운 accessToken 생성
            const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1m'});
            return {
                accessToken: newAccessToken,
                refreshToken: refreshToken // 기존 refreshToken 재사용
            };
        } catch (error) {
            // refreshToken이 만료되거나 유효하지 않을 경우
            if (error instanceof jwt.TokenExpiredError) {
                const decodedToken: any = jwt.decode(refreshToken);
                const userId = decodedToken.id;
                if(userId) {
                    const firebaseToken = await this.bringFirebaseToken(userId);
                    await this.firebaseTokenRepository.deleteTokensByUserId(userId, firebaseToken);
                }
                throw new Error('세션이 만료되었습니다. 재로그인 부탁드립니다.');
            } else {
                throw new Error('유효하지 않은 토큰입니다. 재로그인 부탁드립니다.');
            }
        }
    }
    private async bringFirebaseToken(userId: number): Promise<string> {
        const token = await this.firebaseTokenRepository.findOne( { where: { user: { id: userId } } });
        if(!token) {
            throw new Error('Firebase token not found for user')
        }
        return token.token;
    }
}