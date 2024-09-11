
import { Service } from 'typedi';
import { redisClient } from "../config/redis";
import { promisify } from 'util';

const getAsync = promisify(redisClient.get).bind(redisClient);

@Service()
export class RedisService {

    public getAsync = promisify(redisClient.get).bind(redisClient);

    // async penetrateRefreshToken(token: string, userId: number) {
    //     await redisClient.set(String(userId), token)
    //     console.log('리프레시 토큰 저장 완료: ', token);
    // }

    async deleteValue(key: string) {
        await redisClient.del(key);

    }

    // async bringRefreshToken(userId: number) {
    //     const token = await redisClient.get(`refreshToken_${userId}`);
    //     console.log(`ID가 ${userId}인 사용자의 리프레시 토큰:`, token);
    //     return token;
    // }

    async setValue(key:string, value:string){
        await redisClient.set(key, value);
    }

    async getValue(key:string){
        return getAsync(key);
    }
}