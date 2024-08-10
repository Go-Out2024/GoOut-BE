
import schedule from 'node-schedule';
import { YouTubeSchedule } from './YouTubeSchedule.js';
import Container from 'typedi';
import { RedisService } from "../service/Redis.Service.js";
import { YouTubeApi } from "./YouTubeApi.js";

export const settingRecommendMusic = async () => {

    await schedule.scheduleJob(

        '0 0 0 1 * *'
//'*/10 * * * * *'
     //  '*/1 * * * *'
        , async function () {       // UTC시간 기준 9시간 차이로 새벽 12시 의미 
            await new YouTubeSchedule(new RedisService, new YouTubeApi).youtubeScheduler();
    });
    console.log("스케줄링 완료")
}




