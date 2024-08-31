

import { Body, Get, HttpCode, JsonController, Post, QueryParam, Req } from "routing-controllers";
import { Service } from "typedi";
import { SuccessResponseDto } from "../response/SuccessResponseDto";
import { KakaoService } from "../service/Kakao.Service";
import { KakaoEatery } from "../dto/response/KakaoEatery";


@Service()
@JsonController('/kakao')
export class KakaoController{

    constructor(
        private readonly kakaoService:KakaoService
    ){}

    /**
     * 좌표, 거리별 음식점, 카페 조회 함수
     * @param x x 좌표
     * @param y y 좌표
     * @param category 카테고리 -> 음식점, 카페
     * @param radius 반지름 거리
     * @returns 
     */
    @HttpCode(200)
    @Get('/eateries')
    async bringKakaoRestaurant(
        @QueryParam('x') x: string,
        @QueryParam('y') y: string,
        @QueryParam('category') category:string,
        @QueryParam('radius') radius:string
    ):Promise<SuccessResponseDto<KakaoEatery[]>> {
        const result = await this.kakaoService.bringKakaoEatery(x,y,category,radius);
        console.log("카카오 음식점 or 카페 정보 조회 완료");
        return SuccessResponseDto.of(result);
    }
}