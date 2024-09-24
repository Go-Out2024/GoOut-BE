
import { HourlyWeatherDataDto } from '../../../src/dto/values/HourlyWeatherData';
import { formatWeatherData } from '../../../src/util/weatherData'; 

describe('formatWeatherData', () => {

    it('correctly format weather data', () => {
        const mockWeatherData = [
            { category: 'TMP', fcstDate: '20230923', fcstTime: '0600', fcstValue: '18' },
            { category: 'PTY', fcstDate: '20230923', fcstTime: '0600', fcstValue: '0' },
            { category: 'SKY', fcstDate: '20230923', fcstTime: '0600', fcstValue: '1' },
            { category: 'TMP', fcstDate: '20230923', fcstTime: '1500', fcstValue: '25' },
            { category: 'PTY', fcstDate: '20230923', fcstTime: '1500', fcstValue: '0' },
            { category: 'SKY', fcstDate: '20230923', fcstTime: '1500', fcstValue: '1' },
            { category: 'TMN', fcstDate: '20230923', fcstTime: '0600', fcstValue: '15' },
            { category: 'TMX', fcstDate: '20230923', fcstTime: '1500', fcstValue: '25' }
        ];

        const expectedHourlyData = [
            HourlyWeatherDataDto.of('20230923', '0600', '맑음', '강수 없음', '18℃', '정보 없음'),
            HourlyWeatherDataDto.of('20230923', '1500', '맑음', '강수 없음', '25℃', '정보 없음')
        ];

        const result = formatWeatherData(mockWeatherData);

        expect(result.dailyMinTemp).toBe('15℃');
        expect(result.dailyMaxTemp).toBe('25℃');
        expect(result.hourlyData).toEqual(expectedHourlyData);
    });

    it('missing TMP, PCP, SKY, and PTY data with default values', () => {
        const mockWeatherData = [
            { category: 'PTY', fcstDate: '20230923', fcstTime: '0600', fcstValue: '' },
            { category: 'SKY', fcstDate: '20230923', fcstTime: '1500', fcstValue: '' }
        ];

        const expectedHourlyData = [
            HourlyWeatherDataDto.of('20230923', '0600', '정보 없음', '정보 없음', '정보 없음', '정보 없음'),
            HourlyWeatherDataDto.of('20230923', '1500', '정보 없음', '정보 없음', '정보 없음', '정보 없음')
        ];

        const result = formatWeatherData(mockWeatherData);

        expect(result.dailyMinTemp).toBe("정보 없음");
        expect(result.dailyMaxTemp).toBe("정보 없음");
        expect(result.hourlyData).toEqual(expectedHourlyData);
    });

    it('return default values when TMN and TMX are missing', () => {
        const mockWeatherData = [
            { category: 'TMP', fcstDate: '20230923', fcstTime: '0600', fcstValue: '18' },
            { category: 'PTY', fcstDate: '20230923', fcstTime: '0600', fcstValue: '0' },
            { category: 'SKY', fcstDate: '20230923', fcstTime: '0600', fcstValue: '1' }
        ];

        const expectedHourlyData = [
            HourlyWeatherDataDto.of('20230923', '0600', '맑음', '강수 없음', '18℃', '정보 없음')
        ];

        const result = formatWeatherData(mockWeatherData);

        expect(result.dailyMinTemp).toBe("정보 없음");
        expect(result.dailyMaxTemp).toBe("정보 없음");
        expect(result.hourlyData).toEqual(expectedHourlyData);
    });

    it('should handle data across multiple dates and sort by date and time', () => {
        const mockWeatherData = [
            { category: 'TMP', fcstDate: '20230923', fcstTime: '0600', fcstValue: '18' },
            { category: 'PTY', fcstDate: '20230923', fcstTime: '0600', fcstValue: '0' },
            { category: 'SKY', fcstDate: '20230923', fcstTime: '0600', fcstValue: '1' },
            { category: 'TMP', fcstDate: '20230924', fcstTime: '1200', fcstValue: '22' },
            { category: 'PTY', fcstDate: '20230924', fcstTime: '1200', fcstValue: '1' },
            { category: 'SKY', fcstDate: '20230924', fcstTime: '1200', fcstValue: '4' }
        ];

        const expectedHourlyData = [
            HourlyWeatherDataDto.of('20230923', '0600', '맑음', '강수 없음', '18℃', '정보 없음'),
            HourlyWeatherDataDto.of('20230924', '1200', '흐림', '비', '22℃', '정보 없음')
        ];

        const result = formatWeatherData(mockWeatherData);

        expect(result.hourlyData).toEqual(expectedHourlyData);
    });

    it('should handle all SKY codes and sort data correctly', () => {
        const mockWeatherData = [
            { category: 'TMP', fcstDate: '20230924', fcstTime: '1200', fcstValue: '22' },
            { category: 'PTY', fcstDate: '20230924', fcstTime: '1200', fcstValue: '0' },
            { category: 'SKY', fcstDate: '20230924', fcstTime: '1200', fcstValue: '4' },
            { category: 'TMP', fcstDate: '20230923', fcstTime: '1800', fcstValue: '20' },
            { category: 'PTY', fcstDate: '20230923', fcstTime: '1800', fcstValue: '0' },
            { category: 'SKY', fcstDate: '20230923', fcstTime: '1800', fcstValue: '3' },
            { category: 'TMP', fcstDate: '20230923', fcstTime: '0600', fcstValue: '18' },
            { category: 'PTY', fcstDate: '20230923', fcstTime: '0600', fcstValue: '0' },
            { category: 'SKY', fcstDate: '20230923', fcstTime: '0600', fcstValue: '1' },
        ];

        const expectedHourlyData = [
            HourlyWeatherDataDto.of('20230923', '0600', '맑음', '강수 없음', '18℃', '정보 없음'),
            HourlyWeatherDataDto.of('20230923', '1800', '구름많음', '강수 없음', '20℃', '정보 없음'),
            HourlyWeatherDataDto.of('20230924', '1200', '흐림', '강수 없음', '22℃', '정보 없음'),
        ];

        const result = formatWeatherData(mockWeatherData);

        expect(result.hourlyData).toEqual(expectedHourlyData);
    });

    it('should handle missing SKY values', () => {
        const mockWeatherData = [
            { category: 'TMP', fcstDate: '20230923', fcstTime: '0600', fcstValue: '18' },
            { category: 'PTY', fcstDate: '20230923', fcstTime: '0600', fcstValue: '0' },
            { category: 'SKY', fcstDate: '20230923', fcstTime: '0600', fcstValue: '5' }, // Invalid SKY code
        ];

        const expectedHourlyData = [
            HourlyWeatherDataDto.of('20230923', '0600', '정보 없음', '강수 없음', '18℃', '정보 없음'),
        ];

        const result = formatWeatherData(mockWeatherData);

        expect(result.hourlyData).toEqual(expectedHourlyData);
    });

    it('should handle PCP values correctly', () => {
        const mockWeatherData = [
            { category: 'TMP', fcstDate: '20230923', fcstTime: '0600', fcstValue: '18' },
            { category: 'PTY', fcstDate: '20230923', fcstTime: '0600', fcstValue: '1' },
            { category: 'SKY', fcstDate: '20230923', fcstTime: '0600', fcstValue: '1' },
            { category: 'PCP', fcstDate: '20230923', fcstTime: '0600', fcstValue: '1.0mm' },
            { category: 'TMP', fcstDate: '20230923', fcstTime: '0700', fcstValue: '19' },
            { category: 'PTY', fcstDate: '20230923', fcstTime: '0700', fcstValue: '1' },
            { category: 'SKY', fcstDate: '20230923', fcstTime: '0700', fcstValue: '1' },
            { category: 'PCP', fcstDate: '20230923', fcstTime: '0700', fcstValue: '1.5' },
        ];

        const expectedHourlyData = [
            HourlyWeatherDataDto.of('20230923', '0600', '맑음', '비', '18℃', '1.0mm'),
            HourlyWeatherDataDto.of('20230923', '0700', '맑음', '비', '19℃', '1.5mm'),
        ];

        const result = formatWeatherData(mockWeatherData);

        expect(result.hourlyData).toEqual(expectedHourlyData);
    });

    it('should handle both TMN and TMX values correctly', () => {
        const mockWeatherData = [
            { category: 'TMN', fcstDate: '20230923', fcstTime: '0600', fcstValue: '15' },
            { category: 'TMX', fcstDate: '20230923', fcstTime: '1500', fcstValue: '25' },
            { category: 'TMP', fcstDate: '20230923', fcstTime: '0600', fcstValue: '18' },
            { category: 'PTY', fcstDate: '20230923', fcstTime: '0600', fcstValue: '0' },
            { category: 'SKY', fcstDate: '20230923', fcstTime: '0600', fcstValue: '1' }
        ];
    
        const result = formatWeatherData(mockWeatherData);
    
        expect(result.dailyMinTemp).toBe('15℃');
        expect(result.dailyMaxTemp).toBe('25℃');
    });
    
    it('should return "정보 없음" when TMN and TMX are missing', () => {
        const mockWeatherData = [
            { category: 'TMP', fcstDate: '20230923', fcstTime: '0600', fcstValue: '' },
            { category: 'PTY', fcstDate: '20230923', fcstTime: '0600', fcstValue: '' }
        ];
    
        const result = formatWeatherData(mockWeatherData);
    
        expect(result.dailyMinTemp).toBe('정보 없음');
        expect(result.dailyMaxTemp).toBe('정보 없음');
    });
    

});