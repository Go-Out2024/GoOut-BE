import { Service } from "typedi";
import { RedisService } from "../service/Redis.Service";
import { YouTubeApi } from "./YouTubeApi";
import { musicRecommend } from "./openAi";

@Service()
export class YouTubeSchedule {
  constructor(
    private readonly redisService: RedisService,
    private readonly youtubeApi: YouTubeApi
  ) {}

  async youtubeScheduler() {
    let recommentMusic = await musicRecommend();
    const beforeMusic = await this.redisService.getValue("today-music");
    this.checkData(recommentMusic, beforeMusic);
    const video: any = await this.youtubeApi.bringVideo(recommentMusic);
    this.setVideo(video, recommentMusic);
  }

  async checkData(recommentMusic: string, beforeMusic: string) {
    while (recommentMusic !== beforeMusic) {
      recommentMusic = await musicRecommend();
      await this.redisService.setValue("today-music", recommentMusic);
    }
  }

  async setVideo(video: any, recommentMusic: string) {
    recommentMusic = recommentMusic.replace(/[()]/g, "");
    await this.redisService.setValue(
      "video-url",
      await this.youtubeApi.getVideoUrl(video.id.videoId)
    );
    await this.redisService.setValue(
      "video-image",
      video.snippet.thumbnails.default.url
    );
    await this.redisService.setValue(
      "video-singer",
      recommentMusic.split(",")[0]
    );
    await this.redisService.setValue(
      "video-title",
      recommentMusic.split(",")[1]
    );
  }
}
