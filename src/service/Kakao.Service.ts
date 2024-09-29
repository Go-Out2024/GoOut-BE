
import { Service } from 'typedi';
import { getProductCategoryByCondition } from '../util/enum/EateryCategory';
import { KakaoApiService } from './KakaoApi.Service';
import { verifyEateryCategory } from '../util/verify';
import { KakaoEateryPaging } from '../dto/response/KakaoEateryPaging';
import { KakaoEatery } from '../dto/KakaoEatery';


@Service()
export class KakaoService { 

    constructor(private readonly kakaoApiService: KakaoApiService){}


    /**
     * 
     * @param x x 좌표
     * @param y y 좌표
     * @param category 카테고리 -> 음식점, 카페 
     * @param radius 반경
     * @returns     // 거리 -> distance, 이름 -> place_name, url -> place_url, phone -> 전화번호, road_address_name -> 주소
     */
    async bringKakaoEatery(x:string, y:string, category:string, radius:string, page:string, size: string) {
        verifyEateryCategory(getProductCategoryByCondition(category));
        const eateryData = await this.kakaoApiService.bringEateryData(x,y,getProductCategoryByCondition(category), radius, page, size);
        const kakaoEateryData = this.mappingEateryData(eateryData);
        console.log(kakaoEateryData)
        return KakaoEateryPaging.of(Number(page), 45,kakaoEateryData as KakaoEatery[])
  
    }



    /**
     * 카카오 조회 데이터 매핑 함수
     * @param datas 카카오 조회 데이터
     * @returns 가공된 데이터
     */
    public mappingEateryData(datas:object[]):KakaoEatery[]{
        return datas.map((data:any) => 
            KakaoEatery.of(data.distance as number, data.place_name as string, data.place_url as string, data.phone as string, data.road_address_name as string)     
        )
    }
    


}