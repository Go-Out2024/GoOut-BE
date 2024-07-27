
import schedule from 'node-schedule';
import { musicRecommend } from '../openAi.js';
import { RedisService } from '../../service/Redis.Service.js';

export const settingRecommendMusic = async () => {

    schedule.scheduleJob('*/10 * * * * *', async function () {       // UTC시간 기준 9시간 차이로 새벽 12시 의미
        const result = await musicRecommend();  
        await new RedisService().setValue('today-music', result);
    });
    console.log("스케줄링 완료")
}
