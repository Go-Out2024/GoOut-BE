import { createRequire } from 'module'
const require = createRequire(import.meta.url)
require('dotenv').config();
import { createClient } from 'redis'
import { Service } from 'typedi';

@Service()
export class RedisService {
    private client = createClient ({
        url: `redis://${process.env.AWS_REDIS_ENDPOINT}:${process.env.AWS_REDIS_PORT}`
    });

    constructor() {
        this.initialize();
    }

    private async initialize() {
        try {
            await this.client.connect();
            console.log('레디스 연결');
        } catch (error) {
            console.log('레디스 연결 실패', error);
        }
    }

    async storeRefreshToken(token: string, userId: number) {
        await this.client.set(`refreshToken_${userId}`, token, {
            EX: 60 * 60 * 24 * 30
        });
        console.log('리프레시 토큰 저장 완료: ', token);
    }

    async removeRefreshToken(userId: number) {
        await this.client.del(`refreshToken_${userId}`);
        console.log(`ID가 ${userId}인 사용자의 리프레시 토큰 삭제 완료`);
    }

    async getRefreshToken(userId: number) {
        const token = await this.client.get(`refreshToken_${userId}`);
        console.log(`ID가 ${userId}인 사용자의 리프레시 토큰:`, token);
        return token;
    }
}