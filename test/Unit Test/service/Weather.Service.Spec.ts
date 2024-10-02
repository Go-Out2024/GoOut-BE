import { WeatherService } from '../../../src/service/Weather.Service';
import axios, { AxiosResponse } from 'axios';
import { BusStationRepository } from '../../../src/repository/BusStation.Repository';
import { SubwayStationRepository } from '../../../src/repository/SubwayStation.Repository';
import { GridCoordinatesRepository } from '../../../src/repository/GridCoordinates.Repository';
import { envs } from '../../../src/config/environment';
import { formatWeatherData } from '../../../src/util/weatherData';
import { verifyCoordinates } from '../../../src/util/verify';
import { HourlyWeatherDataDto } from '../../../src/dto/values/HourlyWeatherData';
import { BusStation } from '../../../src/entity/BusStation';
import { SubwayStation } from '../../../src/entity/SubwayStation';
import { GridCoordinates } from '../../../src/entity/GridCoordinates';

jest.mock('axios');
jest.mock('../../../src/util/weatherData');
jest.mock('../../../src/util/verify');
jest.mock('../../../src/repository/BusStation.Repository');
jest.mock('../../../src/repository/SubwayStation.Repository');
jest.mock('../../../src/repository/GridCoordinates.Repository');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedFormatWeatherData = formatWeatherData as jest.MockedFunction<typeof formatWeatherData>;
const mockedVerifyCoordinates = verifyCoordinates as jest.MockedFunction<typeof verifyCoordinates>;
const mockWeatherSuccessResponse: AxiosResponse<any> = {
    data: {
        response: {
            body: {
                items: {
                    item: [
                        { date: '2024-09-23', time: '0600', temperature: 23 }
                    ]
                }
            }
        }
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
} as AxiosResponse<any>;

describe('WeatherService Test', () => {

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    let weatherService: WeatherService;
    const busStationRepository = new BusStationRepository() as jest.Mocked<BusStationRepository>;
    const subwayStationRepository = new SubwayStationRepository() as jest.Mocked<SubwayStationRepository>;
    const gridCoordinatesRepository = new GridCoordinatesRepository() as jest.Mocked<GridCoordinatesRepository>;

    beforeEach(() => {
        weatherService = new WeatherService(busStationRepository, subwayStationRepository, gridCoordinatesRepository);
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });

    describe('bringCoordinates function test', () => {
        it('should return coordinates for bus station', async () => {
            const mockBusStationCoordinates = {} as BusStation;
            jest.spyOn(busStationRepository, 'findCoordinatesByBusStationName').mockResolvedValue(mockBusStationCoordinates);

            const result = await weatherService.bringCoordinates('Bus Station', 'bus');
            expect(result).toEqual(mockBusStationCoordinates);
            expect(mockedVerifyCoordinates).toHaveBeenCalledWith(mockBusStationCoordinates);
        });

        it('should return coordinates for subway station', async () => {
            const mockSubwayStationCoordinates = {} as SubwayStation;
            jest.spyOn(subwayStationRepository, 'findCoordinatesBySubwayStationName').mockResolvedValue(mockSubwayStationCoordinates);

            const result = await weatherService.bringCoordinates('Subway Station', 'subway');
            expect(result).toEqual(mockSubwayStationCoordinates);
            expect(mockedVerifyCoordinates).toHaveBeenCalledWith(mockSubwayStationCoordinates);
        });
    });

    describe('bringGridCoordinates function test', () => {
        it('basic', async () => {
            const longitude = 127.0;
            const latitude = 37.0;
            const mockGridData = {
                id: 1,
                regionCode: '123',
                longitude: longitude,
                latitude: latitude,
                gridX: 60,
                gridY: 127,
                level1: 'Seoul',
                level2: 'Gangnam',
                level3: 'Station'
            } as GridCoordinates;
            jest.spyOn(gridCoordinatesRepository, 'findGridCoordinatesByLongitudeAndLatitude')
                .mockResolvedValue(mockGridData);
            const result = await weatherService.bringGridCoordinates(longitude, latitude);
            expect(result).toEqual(mockGridData);
            expect(gridCoordinatesRepository.findGridCoordinatesByLongitudeAndLatitude)
                .toHaveBeenCalledWith(longitude, latitude);
        });
    });
    

    describe('bringWeatherData function test', () => {
        it('basic', async () => {
            const mockCoordinates = {} as BusStation | SubwayStation;
            const mockGridData = {id: 1,
                regionCode: '123',
                longitude: 127.0,
                latitude: 37.0,
                gridX: 60,
                gridY: 127,
                level1: 'Seoul',
                level2: 'Gangnam',
                level3: 'Station'} as GridCoordinates;
            jest.spyOn(weatherService, 'bringCoordinates').mockResolvedValue(mockCoordinates);
            jest.spyOn(weatherService, 'bringGridCoordinates').mockResolvedValue(mockGridData);
            mockedAxios.get.mockResolvedValue(mockWeatherSuccessResponse);
            const formattedWeatherData = formatWeatherData(mockWeatherSuccessResponse);
            mockedFormatWeatherData.mockReturnValue(formattedWeatherData);

            const result = await weatherService.bringWeatherData('Bus Station', 'bus', '20240923', '0600');

            expect(result.weatherData).toEqual(formattedWeatherData);
            expect(result.location).toEqual({ level1: 'Seoul', level2: 'Gangnam', level3: 'Station' });
            expect(mockedAxios.get).toHaveBeenCalledWith(expect.any(String), {
                params: {
                    serviceKey: envs.apikey.weatherapikey,
                    pageNo: 1,
                    numOfRows: 305,
                    dataType: 'JSON',
                    base_date: '20240923',
                    base_time: '0600',
                    nx: 60,
                    ny: 127
                }
            });
        });
    });

    describe('bringWeatherForLocations function test', () => {
        it('should return weather data for both start and end locations', async () => {
            const startName = 'Gangnam Station';
            const startType = 'subway';
            const endName = 'Seoul Station';
            const endType = 'subway';
            const baseDate = '20230922';
            const baseTime = '0900';
            const mockStartWeather = {
                weatherData: formatWeatherData(mockWeatherSuccessResponse),
                location: { level1: 'Seoul', level2: 'Gangnam', level3: 'Gangnam Station' }
            };
            const mockEndWeather = {
                weatherData: formatWeatherData(mockWeatherSuccessResponse),
                location: { level1: 'Seoul', level2: 'Yongsan', level3: 'Seoul Station' }
            };
            jest.spyOn(weatherService, 'bringWeatherData').mockResolvedValueOnce(mockStartWeather).mockResolvedValueOnce(mockEndWeather);
            const result = await weatherService.bringWeatherForLocations(startName, startType, endName, endType, baseDate, baseTime);
            expect(result).toEqual({ startWeather: mockStartWeather, endWeather: mockEndWeather });
            expect(weatherService.bringWeatherData).toHaveBeenCalledWith(startName, startType, baseDate, baseTime);
            expect(weatherService.bringWeatherData).toHaveBeenCalledWith(endName, endType, baseDate, baseTime);
        });
    });
    
});
