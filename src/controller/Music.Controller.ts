import { Get, HttpCode, JsonController } from "routing-controllers";
import { Service } from "typedi";
import { SuccessResponseDto } from "../response/SuccessResponseDto";
import { MusicService } from "../service/Music.Service";

@Service()
@JsonController('/music')
export class MusicController{

    constructor(private readonly musicService:MusicService){}

    @HttpCode(200)
    @Get('/recommend')
    async recommendMusic() {
        const result = await this.musicService.recommendMusic();
        console.log("노래 추천 완료");
        return SuccessResponseDto.of(result);
    }

}