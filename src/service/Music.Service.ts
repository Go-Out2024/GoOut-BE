
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { RedisService } from './Redis.Service.js';
import { Music } from '../dto/response/Music.js';


@Service()
export class MusicService { 

    constructor(private readonly redisService:RedisService){}


    async recommendMusic() {
        const result : string = await this.redisService.getValue("today-music");
        return Music.of(result.split(',')[0], result.split(',')[1], result.split(',')[2])
    }

}