import { Request} from 'express';
import { SuccessResponseDto } from '../../../src/response/SuccessResponseDto';
import {MusicService} from '../../../src/service/Music.Service';
import {MusicController} from '../../../src/controller/Music.Controller';
import { Music } from '../../../src/dto/response/Music';


jest.mock('../../../src/service/Music.Service');

describe('Music Controller Test', ()=>{

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });


    const musicService = new MusicService({} as any) as jest.Mocked<MusicService>;
    const musicController = new MusicController(musicService);

    beforeEach(async () => {
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });
    
    describe('recommendMusic function test', ()=>{

        it('basic', async ()=>{
            const recommendMusicResponse = Music.of('url','image','singer','title');
            musicService.recommendMusic.mockResolvedValue(recommendMusicResponse);
            const result = await musicController.recommendMusic();
            expect(result).toEqual(SuccessResponseDto.of(recommendMusicResponse));
            expect(musicService.recommendMusic).toHaveBeenCalled();
        });

    });
});


