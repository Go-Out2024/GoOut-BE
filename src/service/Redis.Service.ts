import { createRequire } from 'module'
const require = createRequire(import.meta.url)
require('dotenv').config();
import { Service } from 'typedi';
import { redisClient } from "../config/redis.js";


@Service()
export class RedisService {

    async penetrateRefreshToken(token: string, userId: number) {
        await redisClient.set(String(userId), token)
        console.log('리프레시 토큰 저장 완료: ', token);
    }

    async eraseRefreshToken(userId: number) {
        await redisClient.del(`refreshToken_${userId}`);
        console.log(`ID가 ${userId}인 사용자의 리프레시 토큰 삭제 완료`);
    }

    async bringRefreshToken(userId: number) {
        const token = await redisClient.get(`refreshToken_${userId}`);
        console.log(`ID가 ${userId}인 사용자의 리프레시 토큰:`, token);
        return token;
    }
}