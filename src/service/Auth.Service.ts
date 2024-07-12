import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../repository/User.Repository.js';
import jwt from 'jsonwebtoken'
import {RedisService} from './Redis.Service.js'
import { KakaoApiService } from './KakaoApi.Service.js';

import { createRequire } from 'module'
import { FirebaseTokenRepository } from '../repository/FirebaseToken.Repository.js';
const require = createRequire(import.meta.url)
require('dotenv').config();


@Service()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository,
        @InjectRepository(FirebaseTokenRepository) private firebaseTokenRepository: FirebaseTokenRepository,
        private kakaoApiservice: KakaoApiService,
        private redisService: RedisService
    ) {}

    async loginWithKakao(accessToken: string) {
        const userInfo = await this.kakaoApiservice.bringUserInfo(accessToken);
        let user = await this.userRepository.findByKakaoId(userInfo.kakaoId);
        if(!user) {
            user = await this.userRepository.createUser({
                numbers: userInfo.kakaoId,
                email:userInfo.email
        });
        }
  
        const tokens = this.generateJwtTokens(user.id);
        await this.redisService.penetrateRefreshToken(tokens.refreshToken, user.id);
        await this.redisService.bringRefreshToken(user.id);
        return tokens;
    }

    private generateJwtTokens(userId: number) {
        const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d'});
        const refreshToken = jwt.sign({ id: userId}, process.env.JWT_REFRESH_SECRET, { expiresIn: '2d'});
        return { accessToken, refreshToken};
    }

    async logout(refreshToken: string, firebaseToken: string) {
        const decodedToken: any = jwt.decode(refreshToken);
        if (!decodedToken || typeof decodedToken !== 'object') {
            throw new Error('Invalid token');
        }

        console.log(decodedToken);
    
        const userId = decodedToken.id;
        if (!userId) {
            throw new Error('User ID not found in token');
        }
    
        await this.redisService.eraseRefreshToken(userId);
        await this.firebaseTokenRepository.deleteTokensByUserId(userId, firebaseToken);
    }

}
