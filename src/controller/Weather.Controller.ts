import { Body, Get, HttpCode, JsonController, Post, QueryParam, Req } from "routing-controllers";
import { Service } from "typedi";
import { SuccessResponseDto } from "../response/SuccessResponseDto.js";
import { WeatherService } from "../service/Weather.Service.js";

@Service()
@JsonController('/weather')
export class WeatherController {
    constructor(
        private weatherService: WeatherService
    ) {}

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