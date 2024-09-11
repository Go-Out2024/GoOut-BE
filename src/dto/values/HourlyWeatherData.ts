export class HourlyWeatherDataDto {
    private date: string;
    private time: string;
    private skyStatus: string;
    private precipitationType: string;
    private temperature: string;
    private hourlyPrecipitation: string;

    constructor(date: string, time: string, skyStatus: string, precipitationType: string, temperature: string, hourlyPrecipitation: string) {
        this.setDate(date);
        this.setTime(time);
        this.setSkyStatus(skyStatus);
        this.setPrecipitationType(precipitationType);
        this.setTemperature(temperature);
        this.setHourlyPrecipitation(hourlyPrecipitation);
    }

    public static of(date: string, time: string, skyStatus: string, precipitationType: string, temperature: string, hourlyPrecipitation: string) {
        return new HourlyWeatherDataDto(date, time, skyStatus, precipitationType, temperature, hourlyPrecipitation);
    }

    private setDate(date: string) {
        this.date = date;
    }

    private setTime(time: string) {
        this.time = time;
    }

    private setSkyStatus(skyStatus: string) {
        this.skyStatus = skyStatus;
    }

    private setPrecipitationType(precipitationType: string) {
        this.precipitationType = precipitationType;
    }

    private setTemperature(temperature: string) {
        this.temperature = temperature;
    }

    private setHourlyPrecipitation(hourlyPrecipitation: string) {
        this.hourlyPrecipitation = hourlyPrecipitation;
    }
}