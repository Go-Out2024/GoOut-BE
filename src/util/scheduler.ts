
import schedule from 'node-schedule';
import { YouTubeSchedule } from './YouTubeSchedule.js';
import { RedisService } from "../service/Redis.Service.js";
import { YouTubeApi } from "./YouTubeApi.js";
import { Alarm } from '../repository/Alarm.js';
import { createConnection, getConnection, Connection } from 'typeorm';

export const settingRecommendMusic = async () => {

    await schedule.scheduleJob(

        '0 0 0 1 * *'
//'*/10 * * * * *'
     //  '*/1 * * * *'
        , async function () {       // UTC시간 기준 9시간 차이로 새벽 12시 의미 
            await new YouTubeSchedule(new RedisService, new YouTubeApi).youtubeScheduler();
    });
    console.log("노래 추천 스케줄링 완료")
}


export const handleAlarm = async () => {

    await schedule.scheduleJob(

     //   '0 0 0 1 * *'
    //'*/10 * * * * *'
       '*/1 * * * *'
        , async function () {       // UTC시간 기준 9시간 차이로 새벽 12시 의미 
            const connection = getConnection();
            console.log(await new Alarm(connection).findDataForAlarm());

    });
    console.log("알림 스케줄링 완료")
}



