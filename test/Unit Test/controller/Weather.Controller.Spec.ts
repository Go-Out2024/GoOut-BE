import { SuccessResponseDto } from '../../../src/response/SuccessResponseDto';
import { WeatherController } from '../../../src/controller/Weather.Controller';
import { WeatherService } from '../../../src/service/Weather.Service';

jest.mock('../../../src/service/Weather.Service');

describe('Weather Controller Test', () => {

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });
    
    const weatherService = new WeatherService({} as any, {} as any, {} as any,) as jest.Mocked<WeatherService>;
    const weatherController = new WeatherController(weatherService);

    beforeEach(async () => {
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });

    describe('bringWeather function test', () => {
        const startName = '강남역';
        const startType = 'subway';
        const endName = '잠실역';
        const endType = 'subway';
        const baseDate = '20240909';
        const baseTime = '0800';
        it('basic', async () => {
            const mockStartWeather = {
                weatherData: {
                    dailyMinTemp: '15℃',
                    dailyMaxTemp: '25℃',
                    hourlyData: [
                        { date: '20240909', time: '0800', skyStatus: '맑음', precipitationType: '없음', temperature: '20℃', hourlyPrecipitation: '0mm' },
                    ]as never[],
                },
                location: { level1: '서울특별시', level2: '강남구', level3: '역삼동' }
            };
            const mockEndWeather = {
                weatherData: {
                    dailyMinTemp: '18℃',
                    dailyMaxTemp: '28℃',
                    hourlyData: [
                        { date: '20240909', time: '0800', skyStatus: '흐림', precipitationType: '비', temperature: '22℃', hourlyPrecipitation: '10mm' },
                    ] as never[],
                },
                location: { level1: '서울특별시', level2: '송파구', level3: '잠실동' }
            };
            const mockWeatherResponse = { startWeather: mockStartWeather, endWeather: mockEndWeather };
            weatherService.bringWeatherForLocations.mockResolvedValue(mockWeatherResponse);
            const result = await weatherController.bringWeather(startName, startType, endName, endType, baseDate, baseTime);
            expect(result).toEqual(SuccessResponseDto.of(mockWeatherResponse));
            expect(weatherService.bringWeatherForLocations).toHaveBeenCalledWith(startName, startType, endName, endType, baseDate, baseTime);
        });

    })
})