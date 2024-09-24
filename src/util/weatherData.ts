import { HourlyWeatherDataDto } from "../dto/values/HourlyWeatherData";

/**
 * 받은 데이터 클라이언트가 원하는 형식으로 추출하는 함수
 * @param weatherData api 요청을 통해 받은 날씨 데이터
 * @returns 
 */
export const formatWeatherData = (weatherData: any): { dailyMinTemp: string, dailyMaxTemp: string, hourlyData: HourlyWeatherDataDto[] } => {
    const informations: { [key: string]: { [key: string]: { [key: string]: string } } } = {};

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

    const result: HourlyWeatherDataDto[] = []; // 명확한 타입 설정
    const skyCode = { 1: '맑음', 3: '구름많음', 4: '흐림' };
    const ptyCode = { 0: '강수 없음', 1: '비', 2: '비/눈', 3: '눈', 4: '소나기' };

    for (const [date, times] of Object.entries(informations)) {
        for (const [time, values] of Object.entries(times)) {

            const skyStatus = skyCode[values['SKY']] || '정보 없음';
            const precipitationType = ptyCode[values['PTY']] || '정보 없음';
            const temperature = values['TMP'] ? `${values['TMP']}℃` : '정보 없음';
            const hourlyPrecipitation = values['PCP'] ? values['PCP'].includes('mm') ? values['PCP'] : `${values['PCP']}mm` : '정보 없음';

            result.push(
                HourlyWeatherDataDto.of(
                    date,
                    time,
                    skyStatus,
                    precipitationType,
                    temperature,
                    hourlyPrecipitation
                )
            );
        }
    }

    result.sort((a: any, b: any) => {
        if (a.date === b.date) {
            return a.time.localeCompare(b.time);
        }
        return a.date.localeCompare(b.date);
    });

    return {
        // dailyMinTemp: weatherData.find(item => item.category === 'TMN')?.fcstValue + '℃' || '정보 없음',
        // dailyMaxTemp: weatherData.find(item => item.category === 'TMX')?.fcstValue + '℃' || '정보 없음',
        dailyMinTemp: weatherData.find(item => item.category === 'TMN')?.fcstValue !== undefined ?
             weatherData.find(item => item.category === 'TMN').fcstValue + '℃' : 
                '정보 없음',
        dailyMaxTemp: weatherData.find(item => item.category === 'TMX')?.fcstValue !== undefined ? 
            weatherData.find(item => item.category === 'TMX').fcstValue + '℃' : 
                '정보 없음',
        hourlyData: result // HourlyWeatherDataDto[] 타입이 적용된 result
    };
}
