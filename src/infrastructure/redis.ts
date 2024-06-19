import * as redis from 'redis';
import { envs } from '../config/environment.js';



const redisClient = redis.createClient({            // aws  및 로컬 
    url: `redis://${envs.redis.host}:${envs.redis.port}`,
    legacyMode: true
});

const connectToRedis = async () => {
    try {
        console.log(envs.redis.host)
        console.log(envs.redis.port)
        console.log(process.env.AWS_REDIS_ENDPOINT)
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