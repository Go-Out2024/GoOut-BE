
import schedule from 'node-schedule';
import { musicRecommend } from './openAi.js';
import { RedisService } from '../service/Redis.Service.js';
import { YouTube } from './YouTube.js';

export const settingRecommendMusic = async () => {

    await schedule.scheduleJob(
        '*/10 * * * * *'
     //  '*/1 * * * *'
        , async function () {       // UTC시간 기준 9시간 차이로 새벽 12시 의미
        let result = await musicRecommend();  
     // 해당 url을 redis로 조회 후 같다면 gpt 다시 시도, 아니라면 다음으로 넘어감
        const beforeMusic = await new RedisService().getValue(result)
        console.log(beforeMusic);
        while(result === beforeMusic){
            result = await musicRecommend();
            await new RedisService().setValue('today-music', result);
        }
        const video : any = await new YouTube().bringVideo(result);
    // youtube api 로 하나의 url 가져오기
        const videoUrl = await new YouTube().getVideoUrl(video.id.videoId);
        console.log(videoUrl);



        console.log(video.id.videoId)
        console.log(video.snippet.thumbnails.default.url)
   
      
      
   
    });
    console.log("스케줄링 완료")
}
