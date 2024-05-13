import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../repository/UserRepository';
import jwt from 'jsonwebtoken'
import {RedisService} from './RedisService'
import { KakaoApiService } from './KakaoApiService';

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
require('dotenv').config();


@Service()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository,
        private kakaoApiservice: KakaoApiService,
        private redisService: RedisService
    ) {}

    async loginWithKakao(accessToken: string) {
        const userInfo = await this.kakaoApiservice.getUserInfo(accessToken);
        let user = await this.userRepository.findByKakaoId(userInfo.kakaoId);
        console.log(userInfo);
        console.log(user);

        if(!user) {
            user = await this.userRepository.createUser({
                kakaoId: userInfo.kakaoId,
                email: userInfo.email,
                phoneNumber: userInfo.phoneNumber
            });
        }

        const tokens = this.generateJwtTokens(user.id);
        await this.redisService.storeRefreshToken(tokens.refreshToken, user.id);
        await this.redisService.getRefreshToken(user.id);
        return tokens;
    }

    private generateJwtTokens(userId: number) {
        const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '5m'});
        const refreshToken = jwt.sign({ id: userId}, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d'});
        return { accessToken, refreshToken};
    }

    async logout(refreshToken: string) {
        const decodedToken: any = jwt.decode(refreshToken);
        if (!decodedToken || typeof decodedToken !== 'object') {
            throw new Error('Invalid token');
        }

        console.log(decodedToken);
    
        const userId = decodedToken.id;
        if (!userId) {
            throw new Error('User ID not found in token');
        }
    
        await this.redisService.removeRefreshToken(userId);
    }

}