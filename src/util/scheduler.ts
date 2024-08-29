
import schedule from 'node-schedule';
import { YouTubeSchedule } from './YouTubeSchedule.js';
import { RedisService } from "../service/Redis.Service.js";
import { YouTubeApi } from "./YouTubeApi.js";
import { AlarmRepository } from '../repository/Alarm.Repository.js';
import { Alarm } from './Alarm.js';
import {Container} from 'typedi';

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
 
            const datas : any[] = await Container.get(AlarmRepository).findDataForAlarm();
            const alarmService = Container.get(Alarm);
            const data = await alarmService.handleAlarm(datas);
            console.log(data)



    });
    console.log("알림 스케줄링 완료")
}



