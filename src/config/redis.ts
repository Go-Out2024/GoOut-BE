import * as redis from 'redis';
import { envs } from './environment.js';



const redisClient = redis.createClient({            // aws  및 로컬 
    url: `redis://${envs.redis.host}:${envs.redis.port}`,
    legacyMode: true
});

const connectToRedis = async () => {
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

connectToRedis();

export { redisClient };