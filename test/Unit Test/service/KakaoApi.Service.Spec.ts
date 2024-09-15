import { envs } from '../../../src/config/environment';
import {KakaoApiService} from '../../../src/service/KakaoApi.Service';
import axios, {AxiosResponse} from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockKakaoUserSuccessResponse: AxiosResponse<any> = {
    data: { id: '12345', kakao_account:{email: 'email' }},
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  } as AxiosResponse<any>;

const mockKakaoUserFailResponse: AxiosResponse<any> = {
    data: { },
    status: 500,
    statusText: 'FAIL',
    headers: {},
    config: {}
} as AxiosResponse<any>;

const mockKakaoEaterySuccessResponse: AxiosResponse<any> = {
    data: {documents: [{ id: 1, name: 'Test Eatery' }]},
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
} as AxiosResponse<any>;

const mockKakaoEateryFailResponse: AxiosResponse<any> = {
    data: {},
    status: 500,
    statusText: 'OK',
    headers: {},
    config: {}
} as AxiosResponse<any>;

describe('KakaoApi Service Test', ()=>{

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    let kakaoApiService:KakaoApiService;

    beforeEach(async () => {
        kakaoApiService = new KakaoApiService();
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });
    
    describe('bringUserInfo function test', ()=>{
        it('basic',  async () => {
            mockedAxios.get.mockResolvedValue(mockKakaoUserSuccessResponse)
            const result = await kakaoApiService.bringUserInfo('token');
            expect(result).toEqual({kakaoId:mockKakaoUserSuccessResponse.data.id, email:mockKakaoUserSuccessResponse.data.kakao_account.email});
            expect(mockedAxios.get).toHaveBeenCalledWith('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    Authorization: `Bearer token`
                }
            });
        });

        it('get user information error',  async () => {
            mockedAxios.get.mockRejectedValueOnce(mockKakaoUserFailResponse);
            await expect(kakaoApiService.bringUserInfo('token'))
                .rejects
                .toThrowError('카카오에서 사용자 정보 가져오기 실패');
            expect(mockedAxios.get).toHaveBeenCalledWith('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    Authorization: `Bearer token`
                }
            });  
        });
    });

    describe('bringEateryData function test', ()=>{
        const x = 'x';
        const y = 'y';
        const category = 'category';
        const radius = 'radius';
        it('basic', async () => {
            mockedAxios.get.mockResolvedValue(mockKakaoEaterySuccessResponse);
            const result = await kakaoApiService.bringEateryData(x,y,category,radius);
            expect(result).toEqual(mockKakaoEaterySuccessResponse.data.documents);
            expect(mockedAxios.get).toHaveBeenCalledWith(`https://dapi.kakao.com/v2/local/search/category.json?x=${x}&y=${y}&category\_group\_code=${category}&radius=${radius}`, {
                headers: {
                    Authorization: `KakaoAK ${envs.kakao.key}`}
                })
            });
  
            it('should throw an error on failure', async () => {
                mockedAxios.get.mockRejectedValueOnce(mockKakaoEateryFailResponse);
                await expect(kakaoApiService.bringEateryData(x, y, category, radius))
                    .rejects
                    .toThrow('데이터 조회 에러');
                expect(mockedAxios.get).toHaveBeenCalledWith(
                    `https://dapi.kakao.com/v2/local/search/category.json?x=${x}&y=${y}&category_group_code=${category}&radius=${radius}`,
                    {headers: {Authorization: `KakaoAK ${envs.kakao.key}`}});
                });
        });
});