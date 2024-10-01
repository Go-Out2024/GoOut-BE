import { Inject, Service } from 'typedi';
import axios from 'axios';
import { ErrorResponseDto } from '../response/ErrorResponseDto';
import { ErrorCode } from '../exception/ErrorCode';
import { GridCoordinatesRepository } from '../repository/GridCoordinates.Repository';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { envs } from '../config/environment';
import { BusStationRepository } from '../repository/BusStation.Repository';
import { SubwayStationRepository } from '../repository/SubwayStation.Repository';
import { checkData } from '../util/checker';
import { formatWeatherData } from '../util/weatherData';
import { verifyCoordinates } from '../util/verify';
import { BusStation } from '../entity/BusStation';
import { SubwayStation } from '../entity/SubwayStation';

@Service()
export class WeatherService {
    constructor(
        @InjectRepository() private busStationRepository: BusStationRepository,
        @InjectRepository() private subwayStationRepository: SubwayStationRepository,
        @InjectRepository() private gridCoordinatesRepository: GridCoordinatesRepository
    ) {}
    private apikey: string = envs.apikey.weatherapikey;
    private apiUrl: string = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';

    /**
     * 역 또는 정류장 이름의 위도 경도 좌표 조회
     * @param stationName 역 이름
     * @param stationType 역 타입
     * @returns 
     */
    async bringCoordinates(stationName: string, stationType: 'bus' | 'subway') {
        let coordinates: BusStation | SubwayStation
        if (stationType === 'bus') {
            coordinates = await this.busStationRepository.findCoordinatesByBusStationName(stationName);
        } else {
            coordinates = await this.subwayStationRepository.findCoordinatesBySubwayStationName(stationName);
        }

        verifyCoordinates(coordinates);
        return coordinates;
    }

    /**
     * 조회한 역 및 정류장 위도 경도 좌표를 이용한 해당 역 및 정류장의 격자 X, Y값 조회 함수
     * @param longitude 경도
     * @param latitude 위도
     * @returns 
     */
    async bringGridCoordinates(longitude: number, latitude: number) {
        const gridData = await this.gridCoordinatesRepository.findGridCoordinatesByLongitudeAndLatitude(longitude, latitude);

        return gridData;
    }

    /**
     * 해당 역의 날씨 데이터 조회 함수
     * @param stationName 역 이름
     * @param stationType 역 타입
     * @param baseDate 요청 날짜
     * @param baseTime 요청 시간
     * @returns 
     */
    async bringWeatherData(stationName: string, stationType: 'bus' | 'subway', baseDate: string, baseTime: string) {
        const coordinates = await this.bringCoordinates(stationName, stationType);
        const gridCoordinate = await this.bringGridCoordinates(coordinates.xValue, coordinates.yValue);

        const { gridX, gridY, level1, level2, level3 } = gridCoordinate;

        const response = await axios.get(this.apiUrl, {
            params: {
                serviceKey: this.apikey,
                pageNo: 1,
                numOfRows: 1000,
                dataType: 'JSON',
                base_date: baseDate,
                base_time: baseTime,
                nx: gridX,
                ny: gridY,
            }
        });

        const weatherData = response.data.response.body.items.item;

        const formattedWeatherData = formatWeatherData(weatherData);

        return {
            weatherData: formattedWeatherData,
            location: {level1, level2, level3}
        };
    }

    /**
     * 
     * @param startName 출발역 이름
     * @param startType 출발역 타입
     * @param endName 도착역 이름
     * @param endType 도착역 타입
     * @param baseDate 요청 날짜
     * @param baseTime 요청 시간
     * @returns 
     */
    async bringWeatherForLocations(startName: string, startType: 'bus' | 'subway', endName: string, endType: 'bus' | 'subway', baseDate: string, baseTime: string) {
        const startWeather = await this.bringWeatherData(startName, startType, baseDate, baseTime);
        const endWeather = await this.bringWeatherData(endName, endType, baseDate, baseTime);

        return { startWeather, endWeather };
    }
}
