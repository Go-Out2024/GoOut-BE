import { Service } from 'typedi';
import axios from 'axios';
import { getRepository } from 'typeorm';
import { BusStation } from '../entity/BusStation.js';
import { SubwayStation } from '../entity/SubwayStation.js';
import { GridCoordinates } from '../entity/GridCoordinates.js';
import { ErrorResponseDto } from '../response/ErrorResponseDto.js';
import { ErrorCode } from '../exception/ErrorCode.js';

@Service()
export class WeatherService {
    private apikey: string = process.env.API_KEY;
    private apiUrl: string = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';

    async bringCoordinates(stationName: string, stationType: 'bus' | 'subway') {
        let coordinates;
        if (stationType === 'bus') {
            coordinates = await getRepository(BusStation).findOne({ where: {stationName}});
        } else {
            coordinates = await getRepository(SubwayStation).findOne({ where: { subwayName: stationName }});
        }

        if (!coordinates) {
            throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_STATION_NAME);;
        }

        return coordinates;
    }

    async bringGridCoordinates(longitude: number, latitude: number) {
        const tolerance = 0.01; // 기존 0.00001 에서 0.001 로 확대
        console.log(`Searching for grid coordinates near Longitude: ${longitude}, Latitude: ${latitude}`);

        const gridData = await getRepository(GridCoordinates)
          .createQueryBuilder("grid")
          .where("ABS(grid.longitude - :longitude) < :tolerance", { longitude, tolerance })
          .andWhere("ABS(grid.latitude - :latitude) < :tolerance", { latitude, tolerance })
          .getOne();

        console.log(`Grid Data: ${gridData}`);
        return gridData;
    }

    async bringWeatherData(stationName: string, stationType: 'bus' | 'subway', baseDate: string, baseTime: string) {
        const coordinates = await this.bringCoordinates(stationName, stationType);
        const gridCoordinate = await this.bringGridCoordinates(coordinates.xValue, coordinates.yValue);

        if(!gridCoordinate) {
            throw new Error('Grid coordinate not found');
        }

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

        console.log(gridCoordinate.gridX, gridCoordinate.gridY)

        const weatherData = response.data.response.body.items.item;

        // 필요한 데이터 추출 및 정렬
        const formattedWeatherData = this.formatWeatherData(weatherData);

        return {
            weatherData: formattedWeatherData,
            location: {level1, level2, level3}
        };
    }

    formatWeatherData(weatherData: any) {
        const informations = {};

        for (const item of weatherData) {
            const category = item.category;
            const forecastTime = item.fcstTime;
            const forecastValue = item.fcstValue;
            const forecastDate = item.fcstDate;

            if (!informations[forecastDate]) {
                informations[forecastDate] = {};
            }

            if (!informations[forecastDate][forecastTime]) {
                informations[forecastDate][forecastTime] = {};
            }

            informations[forecastDate][forecastTime][category] = forecastValue;
        }

        const result = [];
        const skyCode = { 1: '맑음', 3: '구름많음', 4: '흐림' };
        const ptyCode = { 0: '강수 없음', 1: '비', 2: '비/눈', 3: '눈', 4: '소나기' };

        for (const [date, times] of Object.entries(informations)) {
            for (const [time, values] of Object.entries(times)) {
                console.log(`Values at date ${date} and time ${time}:`, values);

                const skyStatus = skyCode[values['SKY']] || '정보 없음';
                const precipitationType = ptyCode[values['PTY']] || '정보 없음';
                const temperature = values['TMP'] ? `${values['TMP']}℃` : '정보 없음';

                result.push({
                    date,
                    time,
                    skyStatus,
                    precipitationType,
                    temperature,
                    hourlyPrecipitation: values['PCP'] ? values['PCP'].includes('mm') ? values['PCP'] : `${values['PCP']}mm` : '정보 없음',
                });
            }
        }

        // 날짜와 시간순으로 정렬
        result.sort((a, b) => {
            if (a.date === b.date) {
                return a.time.localeCompare(b.time);
            }
            return a.date.localeCompare(b.date);
        });

        return {
            dailyMinTemp: weatherData.find(item => item.category === 'TMN')?.fcstValue + '℃' || '정보 없음',
            dailyMaxTemp: weatherData.find(item => item.category === 'TMX')?.fcstValue + '℃' || '정보 없음',
            hourlyData: result
        };
    }

    async bringWeatherForLocations(startName: string, startType: 'bus' | 'subway', endName: string, endType: 'bus' | 'subway', baseDate: string, baseTime: string) {
        const startWeather = await this.bringWeatherData(startName, startType, baseDate, baseTime);
        const endWeather = await this.bringWeatherData(endName, endType, baseDate, baseTime);

        return { startWeather, endWeather };
    }
}
