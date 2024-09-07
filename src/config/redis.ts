import * as redis from 'redis';
import { envs } from './environment';



const redisClient = redis.createClient({            // aws  및 로컬 
    url: `redis://${envs.redis.host}:${envs.redis.port}`,
    legacyMode: true
});

export const connectToRedis = async () => {
    try {
        redisClient.on('connect', () => {
            console.log('Connected to Redis');
        });
    } catch (error) {
        setTimeout(() => {
            redisClient.on('error', (error) => {
                console.error('Error connecting to Redis:', error);
                redisClient.quit(); // 현재 연결 종료
            });
        }, 3000);
        console.error('Error connecting to Redis:');
    }
};


export { redisClient };


