import { Body, Get, HttpCode, JsonController, Post, QueryParam, Req } from "routing-controllers";
import { Service } from "typedi";
import { SuccessResponseDto } from "../response/SuccessResponseDto";
import { WeatherService } from "../service/Weather.Service";

@Service()
@JsonController('/weather')
export class WeatherController {
    constructor(
        private weatherService: WeatherService
    ) {}

     /**
     * 교통 컬렉션 기준 날씨 조회 함수
     * @param startName 출발역 이름
     * @param startType 출발역 타입 bus or subway
     * @param endName 도착역 이름
     * @param endType 도착역 타입
     * @param baseDate 요청 날짜
     * @param baseTime 요청 시간
     * @returns 
     */

    @Get('/information')
    async bringWeather(
        @QueryParam('startName') startName: string,
        @QueryParam('startType') startType: 'bus' | 'subway',
        @QueryParam('endName') endName: string,
        @QueryParam('endType') endType: 'bus' | 'subway',
        @QueryParam('baseDate') baseDate: string,
        @QueryParam('baseTime') baseTime: string
    ) {
        const result = await this.weatherService.bringWeatherForLocations(startName, startType, endName, endType, baseDate, baseTime);
        console.log('날씨 데이터 가져오기 성공');
        return SuccessResponseDto.of(result);

    }

}