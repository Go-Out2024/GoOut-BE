import { Request} from 'express';
import { SuccessResponseDto } from '../../../src/response/SuccessResponseDto';
import {KakaoController} from '../../../src/controller/Kakao.Controller';
import {KakaoService} from '../../../src/service/Kakao.Service';
import { KakaoEatery } from '../../../src/dto/KakaoEatery';
import { KakaoEateryPaging } from '../../../src/dto/response/KakaoEateryPaging';



jest.mock('../../../src/service/Kakao.Service');


describe('Kakao Controller Test', ()=>{

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    const kakaoService = new KakaoService({} as any) as jest.Mocked<KakaoService>;
    const kakaoController = new KakaoController(kakaoService);

    beforeEach(async () => {
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });
    
    describe('bringKakaoRestaurant function test', ()=>{

        const x = 'x좌표';
        const y = 'y좌표';
        const category = '음식점';
        const radius = '반지름';
        const page = 1;
        const size = '사이즈'

        it('basic', async () => {

            const kakaoEateryDatas = [KakaoEatery.of(10,'place','url','phone','address')];
            const bringKakaoEateryResponse = KakaoEateryPaging.of(page,45,kakaoEateryDatas)
            kakaoService.bringKakaoEatery.mockResolvedValue(bringKakaoEateryResponse);
            const result = await kakaoController.bringKakaoRestaurant(x,y,category,radius,String(page),size);
            expect(result).toEqual(SuccessResponseDto.of(bringKakaoEateryResponse));
            expect(kakaoService.bringKakaoEatery).toHaveBeenCalledWith(x,y,category,radius,String(page),size);
        });

    });
});


