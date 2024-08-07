
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { RedisService } from './Redis.Service.js';
import { Music } from '../dto/response/Music.js';


@Service()
export class MusicService { 

    constructor(private readonly redisService:RedisService){}


    async recommendMusic() {
        const result : string = await this.redisService.getValue("video-url");
        const [ videoUrl, videoImage, videoSinger, videoTitle] = await Promise.all([
            this.redisService.getValue("video-url"),
            this.redisService.getValue("video-image"),
            this.redisService.getValue("video-singer"),
            this.redisService.getValue("video-title")
        ]);
        return Music.of(videoUrl,videoImage,videoSinger,videoTitle)
    }

}

