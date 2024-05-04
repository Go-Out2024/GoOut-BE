import { Service } from 'typedi';
import { UserRepository } from '../repository/UserRepository';
import jwt from 'jsonwebtoken'
import {RedisService} from './RedisService'
import { KakaoApiService } from './KakaoApiService';

require ( 'dotenv' ).config

@Service()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private kakaoApiservice: KakaoApiService,
        private redisService: RedisService
    ) {}

    async loginWithKakao(accessToken: string) {
        const userInfo = await this.kakaoApiservice.getUserInfo(accessToken);
        let user = await this.userRepository.findByKakaoId(userInfo.kakaoId);

        if(!user) {
            user = await this.userRepository.createUser({
                kakaoId: userInfo.kakaoId,
                email: userInfo.email,
                phoneNumber: userInfo.phoneNumber
            });
        }

        const tokens = this.generateJwtTokens(user.id);
        await this.redisService.storeRefreshToken(tokens.refreshToken, user.id);
        return tokens;
    }

    private generateJwtTokens(userId: number) {
        const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '5m'});
        const refreshToken = jwt.sign({ id: userId}, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d'});
        return { accessToken, refreshToken};
    }

    async logout(refreshToken: string) {
        const userId = jwt.decode(refreshToken).indexOf;
        await this.redisService.removeRefreshToken(userId);
    }

}