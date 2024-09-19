import {RedisService} from '../../../src/service/Redis.Service';
import {YouTubeApi} from '../../../src/util/YouTubeApi';
import {YouTubeSchedule} from '../../../src/util/YouTubeSchedule';
import { musicRecommend } from '../../../src/util/openAi';
import { redisClient } from "../../../src/config/redis";


jest.mock('../../../src/service/Redis.Service')
jest.mock('../../../src/util/YouTubeApi')
jest.mock('../../../src/util/openAi')
jest.mock('../../../src/config/redis', () => ({
    redisClient: { 
        set: jest.fn(),
        del: jest.fn(),
        get: jest.fn(),
    },
}));

describe('YouTubeSchedule Util Test', ()=>{

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    let youtubeScheduler:YouTubeSchedule;
    const redisService = new RedisService() as jest.Mocked<RedisService>;
    const youtubeApi = new YouTubeApi() as jest.Mocked<YouTubeApi>;
    const mockMusicRecommend = musicRecommend as jest.Mock;

    beforeEach(async () => {
        youtubeScheduler = new YouTubeSchedule(redisService, youtubeApi);
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });
    

    describe('youtubeScheduler function test', ()=>{

        const recommentMusic = 'music';
        const beforeMusic = 'before-music';
        const video = { id: { videoId: '12345' }, snippet: { thumbnails: { default: { url: 'some-url' } } } };

        it('basic', async ()=>{
            mockMusicRecommend.mockResolvedValue(recommentMusic);
            redisService.getValue.mockResolvedValue(beforeMusic);
            youtubeApi.bringVideo.mockResolvedValue(video);
            const setVideoSpy = jest.spyOn(youtubeScheduler, 'setVideo');
            const checkDataSpy = jest.spyOn(youtubeScheduler, 'checkData')
            await youtubeScheduler.youtubeScheduler();
            expect(redisService.getValue).toHaveBeenCalledWith('today-music');
            expect(checkDataSpy).toHaveBeenCalledWith(recommentMusic, beforeMusic);
            expect(youtubeApi.bringVideo).toHaveBeenCalledWith(recommentMusic);
            expect(setVideoSpy).toHaveBeenCalledWith(video,recommentMusic); 
        });
    });


    describe('checkData function test', ()=>{

        it('recommentMusic equals beforeMusic', async () => {
            const recommentMusic = 'same-music';
            const beforeMusic = 'same-music';
            const newRecommentMusic = 'new-music';
    
            mockMusicRecommend.mockResolvedValue(newRecommentMusic);
            redisService.setValue.mockResolvedValue(undefined);
            await youtubeScheduler.checkData(recommentMusic, beforeMusic);
            expect(musicRecommend).toHaveBeenCalledTimes(1); 
            expect(redisService.setValue).toHaveBeenCalledWith('today-music', newRecommentMusic); 
        });

        it('recommentMusic  different from beforeMusic', async () => {
            const recommentMusic = 'different-music';
            const beforeMusic = 'other-music';
            await youtubeScheduler.checkData(recommentMusic, beforeMusic);
            expect(musicRecommend).not.toHaveBeenCalled(); 
            expect(redisService.setValue).not.toHaveBeenCalled(); 
        });
    });

});