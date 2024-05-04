import { createClient } from 'redis'

require ('dotenv').config

export class RedisService {
    private client = createClient ({
        url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
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