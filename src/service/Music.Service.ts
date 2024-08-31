
import { Service } from 'typedi';
import { RedisService } from './Redis.Service';
import { Music } from '../dto/response/Music';


@Service()
export class MusicService { 

    constructor(private readonly redisService:RedisService){}


    async recommendMusic() {
        const [ videoUrl, videoImage, videoSinger, videoTitle] = await Promise.all([
            this.redisService.getValue("video-url"),
            this.redisService.getValue("video-image"),
            this.redisService.getValue("video-singer"),
            this.redisService.getValue("video-title")
        ]);
        return Music.of(videoUrl,videoImage,videoSinger,videoTitle)
    }

}

