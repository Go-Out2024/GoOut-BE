import { RedisService } from '../../../src/service/Redis.Service';
import { ErrorCode } from '../../../src/exception/ErrorCode';
import { ErrorResponseDto } from '../../../src/response/ErrorResponseDto';
import {MusicService} from '../../../src/service/Music.Service';
import { Music } from '../../../src/dto/response/Music';

jest.mock('../../../src/service/Redis.Service')



describe('Music Service Test', ()=>{

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    const redisService = new RedisService() as jest.Mocked<RedisService>;
    let musicService : MusicService
   
    

    beforeEach(async () => {
        musicService = new MusicService(redisService);
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });
    


    describe('recommendMusic function test', ()=>{

        const recommendMusicResponse = Music.of('url','image','singer','title');
 
        it('basic',  async () => {
            redisService.getValue.mockResolvedValueOnce('url')
                .mockResolvedValueOnce('image')
                .mockResolvedValueOnce('singer')
                .mockResolvedValueOnce('title')
            const result = await musicService.recommendMusic();

            expect(result).toEqual(recommendMusicResponse);
            expect(redisService.getValue).toHaveBeenCalledWith('video-url');
            expect(redisService.getValue).toHaveBeenCalledWith('video-image');
            expect(redisService.getValue).toHaveBeenCalledWith('video-singer');
            expect(redisService.getValue).toHaveBeenCalledWith('video-title');
         
        });
    });


});