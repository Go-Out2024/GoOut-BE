import { KakaoEatery } from '../../../src/dto/response/KakaoEatery';
import { ErrorCode } from '../../../src/exception/ErrorCode';
import { ErrorResponseDto } from '../../../src/response/ErrorResponseDto';
import {KakaoService} from '../../../src/service/Kakao.Service';
import {KakaoApiService} from '../../../src/service/KakaoApi.Service';
import {getProductCategoryByCondition} from '../../../src/util/enum/EateryCategory';
import { verifyEateryCategory } from '../../../src/util/verify';
jest.mock('../../../src/service/KakaoApi.Service')
jest.mock('../../../src/util/enum/EateryCategory')
jest.mock('../../../src/util/verify')


describe('Kakao Service Test', ()=>{

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    const kakaoApiService = new KakaoApiService() as jest.Mocked<KakaoApiService>;
    let kakaoService : KakaoService
   
    

    beforeEach(async () => {
        kakaoService = new KakaoService(kakaoApiService);
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });
    


    describe('bringKakaoEatery function test', ()=>{
        const x = 'x';
        const y = 'y';
        const category = 'category';
        const radius = '100';
        const mockGetProductCategoryByCondition = getProductCategoryByCondition as jest.Mock;
        const mockVerifyEateryCategory = verifyEateryCategory as jest.Mock;
        const eateryData = {};
        const mappedEateryData = {} as KakaoEatery[]; 

        it('basic',  async () => {
            mockGetProductCategoryByCondition.mockReturnValue('category');
            kakaoApiService.bringEateryData.mockResolvedValue(eateryData);
            const mappingEateryDataMock = jest.spyOn(kakaoService, 'mappingEateryData').mockReturnValue(mappedEateryData);
            const result = await kakaoService.bringKakaoEatery(x,y,category,radius);

            expect(result).toEqual(mappedEateryData)
            expect(mockGetProductCategoryByCondition).toHaveBeenCalledWith('category');
            expect(mockVerifyEateryCategory).toHaveBeenCalledWith('category');
            expect(kakaoApiService.bringEateryData).toHaveBeenCalledWith(x,y,category,radius);
            expect(mappingEateryDataMock).toHaveBeenCalledWith(eateryData)
        });

        it('error NOT_FOUND_EATERY_CATEGORY',  async () => {
            mockGetProductCategoryByCondition.mockReturnValue(undefined);
            mockVerifyEateryCategory.mockImplementation(()=>{
                throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_EATERY_CATEGORY);
            })
            kakaoApiService.bringEateryData.mockResolvedValue(eateryData);
            const mappingEateryDataMock = jest.spyOn(kakaoService, 'mappingEateryData').mockReturnValue(mappedEateryData);
           
            await expect(kakaoService.bringKakaoEatery(x,y,category,radius)).rejects.toEqual(ErrorResponseDto.of(ErrorCode.NOT_FOUND_EATERY_CATEGORY))
            expect(mockGetProductCategoryByCondition).toHaveBeenCalledWith(category);
            expect(mockVerifyEateryCategory).toHaveBeenCalledWith(undefined);
            expect(kakaoApiService.bringEateryData).not.toHaveBeenCalledWith(x,y,category,radius);
            expect(mappingEateryDataMock).not.toHaveBeenCalledWith(eateryData)
        });
    });


    describe('mappingEateryData function test', ()=>{
        const input = [
            { distance: 100, place_name: 'Test Place', place_url: 'http://test.com', phone: '010-1234-5678', road_address_name: 'Test Road' },
            { distance: 200, place_name: 'Another Place', place_url: 'http://another.com', phone: '010-9876-5432', road_address_name: 'Another Road' }
        ];

        const expected = [
            KakaoEatery.of(100, 'Test Place', 'http://test.com', '010-1234-5678', 'Test Road'),
            KakaoEatery.of(200, 'Another Place', 'http://another.com', '010-9876-5432', 'Another Road')
        ];
       
        it('basic',  async () => {
            const result = kakaoService.mappingEateryData(input);
            expect(result).toEqual(expected);    
        });
    });
});