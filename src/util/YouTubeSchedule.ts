import { Service } from "typedi";
import { RedisService } from "../service/Redis.Service.js";
import { YouTubeApi } from "./YouTubeApi.js";
import { musicRecommend } from './openAi.js';

@Service()
export class YouTubeSchedule{


    constructor(
        private readonly redisService:RedisService,
        private readonly youtubeApi:YouTubeApi
    ){}

    async youtubeScheduler(){
        let recommentMusic = await musicRecommend();  
        const beforeMusic = await this.redisService.getValue('today-music');
        this.checkData(recommentMusic, beforeMusic);
        const video : any = await this.youtubeApi.bringVideo(recommentMusic);
        this.setVideo(video);
    }

    async checkData(recommentMusic:string, beforeMusic:string){
        while(recommentMusic === beforeMusic){
            recommentMusic = await musicRecommend();
            await this.redisService.setValue('today-music', recommentMusic);
        }
    }

    async setVideo(video:any){
        await this.redisService.setValue("video-url",  await this.youtubeApi.getVideoUrl(video.id.videoId));
        await this.redisService.setValue('video-image', video.snippet.thumbnails.default.url);
        console.log(await this.youtubeApi.getVideoUrl(video.id.videoId))
    }
}