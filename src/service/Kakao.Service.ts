import axios from 'axios';
import { response } from 'express';
import { Service } from 'typedi';
import { checkData } from '../util/checker.js';
import { ErrorResponseDto } from '../response/ErrorResponseDto.js';
import { ErrorCode } from '../exception/ErrorCode.js';
import { getProductCategoryByCondition } from '../util/enum/EateryCategory.js';
import { KakaoApiService } from './KakaoApi.Service.js';
import { KakaoEatery } from '../dto/response/KakaoEatery.js';


@Service()
export class KakaoService { 

    constructor(private readonly kakaoApiService: KakaoApiService){}

    // 거리 -> distance, 이름 -> place_name, url -> place_url
    async bringKakaoEatery(x:string, y:string, category:string, radius:string) {
        this.verifyEateryCategory(getProductCategoryByCondition(category));
        const eateryData = await this.kakaoApiService.bringEateryData(x,y,getProductCategoryByCondition(category), radius);
        const mappedEateryDatas = this.mappingEateryData(eateryData);
        return mappedEateryDatas;
  
    }

    /**
     * 카테고리 검증 함수
     * @param data 확인할 데이터
     */
    public verifyEateryCategory(data:string){
        if(!checkData(data)){
            throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_EATERY_CATEGORY);
        }
    }

    /**
     * 카카오 조회 데이터 매핑 함수
     * @param datas 카카오 조회 데이터
     * @returns 가공된 데이터
     */
    public mappingEateryData(datas:object[]):KakaoEatery[]{
        return datas.map((data:any) => {
            return KakaoEatery.of(data.distance as number, data.place_name as string, data.place_url as string);     
        })
    }
    


}