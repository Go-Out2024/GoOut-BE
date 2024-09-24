import {YouTubeApi} from '../../../src/util/YouTubeApi';
import {envs} from '../../../src/config/environment';
import axios from 'axios';



const axiosResponse = {
    data: {
        items: [
            {
                id: { videoId: 'mockVideoId' },
                snippet: {
                    title: 'Mock Video Title',
                    description: 'Mock Description',
                    thumbnails: {
                        default: { url: 'mockThumbnailUrl' }
                    }
                }
            }
        ]
    }
};

jest.mock('axios');

describe('YouTubeApi Util Test', () => {

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    let youtubeApi : YouTubeApi;


    beforeEach(async () => {
        youtubeApi = new YouTubeApi();
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });

    describe('bringVideo function test', () => {

        const YOUTUBE_URL="https://www.googleapis.com/youtube/v3/search?part=snippet";
        it('basic', async () => {
            (axios.get as jest.Mock).mockResolvedValue(axiosResponse);
            const result = await youtubeApi.bringVideo('mockSearchWord');
            expect(axios.get).toHaveBeenCalledWith(`${YOUTUBE_URL}&q=mockSearchWord&key=${envs.apikey.youtubeapikey}&maxResults=1`);
            expect(result).toEqual(axiosResponse.data.items[0]);
        });

        it('error', async () => {
            (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));
            await expect(youtubeApi.bringVideo('mockSearchWord')).rejects.toThrow('유튜브 조회 실패:');
            expect(axios.get).toHaveBeenCalledWith(`${YOUTUBE_URL}&q=mockSearchWord&key=${envs.apikey.youtubeapikey}&maxResults=1`);
        });
    });


    describe('getVideoUrl function test', () => {
        const videoId = 'videoId';

        it('basic', async () => {
            const result = await youtubeApi.getVideoUrl(videoId);
            expect(result).toEqual(`https://www.youtube.com/watch?v=${videoId}`)
        });
    });
});
