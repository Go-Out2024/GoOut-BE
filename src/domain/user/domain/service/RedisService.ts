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
    }

    async removeRefreshToken(userId: number) {
        await this.client.del(`refreshToken_${userId}`);
    }
}