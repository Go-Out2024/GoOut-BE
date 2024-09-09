export class WeatherResponseDto {
    startWeather: {
        weatherData: WeatherDataDto;
        location: WeatherLocationDto;
    };
    endWeather: {
        weatherData: WeatherDataDto;
        location: WeatherLocationDto;
    };

    constructor(startWeather: any, endWeather: any) {
        this.startWeather = startWeather;
        this.endWeather = endWeather;
    }
}

export class HourlyDataDto {
    date: string;
    time: string;
    skyStatus: string;
    precipitationType: string;
    temperature: string;
    hourlyPrecipitation: string;

    constructor(
        date: string, 
        time: string, 
        skyStatus: string, 
        precipitationType: string, 
        temperature: string, 
        hourlyPrecipitation: string
    ) {
        this.date = date;
        this.time = time;
        this.skyStatus = skyStatus;
        this.precipitationType = precipitationType;
        this.temperature = temperature;
        this.hourlyPrecipitation = hourlyPrecipitation;
    }
}

export class WeatherDataDto {
    dailyMinTemp: string;
    dailyMaxTemp: string;
    hourlyData: HourlyDataDto[];

    constructor(dailyMinTemp: string, dailyMaxTemp: string, hourlyData: HourlyDataDto[] = []) {
        this.dailyMinTemp = dailyMinTemp;
        this.dailyMaxTemp = dailyMaxTemp;
        this.hourlyData = hourlyData;
    }
}

export class WeatherLocationDto {
    level1: string;
    level2: string;
    level3: string;
}


