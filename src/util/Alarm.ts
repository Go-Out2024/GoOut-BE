import { Service } from "typedi";
import { TrafficService } from "../service/Traffic.Service";
import {
  BusStationResult,
  StationResult,
  SubwayStationResult,
} from "../dto/values/StationResult";
import { pushNotice } from "./firebaseMessage";
import {
  amCheck,
  getTodayDate,
  mappingTodayWeatherDate,
  weatherTime,
} from "./date";
import { CalendarService } from "../service/Calendar.Service";
import { CalendarData, CalendarDatas } from "../dto/response/CalendarData";
import { WeatherService } from "../service/Weather.Service";
import { HourlyWeatherDataDto } from "../dto/values/HourlyWeatherData";

@Service()
export class Alarm {
  constructor(
    private readonly trafficService: TrafficService,
    private readonly calendarService: CalendarService,
    private readonly weatherService: WeatherService
  ) {}

  /**
   * 유저 정보에 따른 알림 전송 함수
   * @param datas 유저 정보
   */
  public async handleAlarm(datas: any[]) {
    await Promise.all(
      datas.map(async (data: any) => {
        const transportationData =
          await this.trafficService.bringMainTrafficCollection(data.user_id);
        await this.processTransportationData(transportationData, data);
      })
    );
  }

  /**
   * 푸쉬 알림을 보내기 위한 로직 함수(교통, 날씨, 캘린더)
   * @param transportationData 교통수단 데이터
   * @param userData 유저 데이터
   */
  private async processTransportationData(
    transportationData: any,
    userData: any
  ) {
    if (transportationData && transportationData.result) {
      const arrivalDatas = this.extractTransportationArrivalInfo(
        transportationData.result
      );
      const flagDatas = this.checkTransportationTime(
        arrivalDatas as unknown as {
          transportation: string;
          arrival: string;
          busNumber: string;
          stationName: string;
          destination: string;
        }[]
      );

      // 날씨 정보 추가
      const location =
        transportationData.collection.trafficCollectionDetails[0]
          .transportations;

      const timeBasedLocation = this.getTimeBasedLocations(location);

      const transportationNameLower =
        timeBasedLocation[0].transportationName.toLowerCase();

      const weatherData = await this.weatherService.bringWeatherData(
        timeBasedLocation[0].stationName,
        transportationNameLower,
        mappingTodayWeatherDate(new Date()),
        weatherTime()
      );

      const rainAndSnow = this.checkRainAndSnow(
        weatherData.weatherData.hourlyData
      );

      // 시간 체킹
      const timeChecking = amCheck();
      // 캘린더 정보 추출
      const calendarDatas = await this.getTodayCalendarData(
        timeChecking,
        userData.user_id
      );
      // 캘린더 메시지 추출
      const extractedCalendar = this.extractCalendarInfo(
        calendarDatas.getCalendarDatas()
      );

      await this.sendPushAlarm(
        userData.token,
        flagDatas,
        extractedCalendar,
        `최고 : ${
          weatherData.weatherData.dailyMaxTemp.split(".")[0]
        }℃, 최저 : ${
          weatherData.weatherData.dailyMinTemp.split(".")[0]
        }℃ ${rainAndSnow}`
      );
    }
  }

  /**
   * 비, 날씨에 따라 우산 필요 여부 판단 함수
   * @param hourlyWeatherData 시간별 데이터
   * @returns 우산 필요 메시지
   */
  private checkRainAndSnow(hourlyWeatherData: HourlyWeatherDataDto[]): string {
    const skyStatus = ["비", "빗방울", "소나기", "비/눈", "눈", "눈날림"];
    const needUmbrella = hourlyWeatherData.find((data) =>
      skyStatus.includes(data.getPrecipitationType())
    );
    return needUmbrella ? "⛱️필요" : "";
  }

  /**
   * 시간에 따른 도착지, 출발지 정보 구분 함수
   * @param location 위치(출발지, 도착지)
   * @returns 출발지 or 도착지 정보
   */
  private getTimeBasedLocations(location: any) {
    const departure = location.filter((data) => data.route === "departure");
    const arrival = location.filter((data) => data.route === "arrival");
    if (new Date().getHours() < 14) {
      return departure;
    }
    return arrival;
  }

  /**
   * 캘린더 데이터를 푸쉬 메시지 형식의 문자열로 변환해주는 함수
   * @param calendarDatas 캘린더 데이터
   * @returns
   */
  private extractCalendarInfo(calendarDatas: CalendarData[]) {
    const itemDatas = calendarDatas.filter(
      (calendarData) => calendarData.getKind() === "item"
    );
    const scheduleDatas = calendarDatas.filter(
      (calendarData) => calendarData.getKind() === "schedule"
    );
    const itemsInfo = itemDatas.length
      ? "\n소지품 : " + itemDatas.map((item) => item.getContent()).join(", ")
      : "";
    const scheduleInfo = scheduleDatas.length
      ? "\n스케쥴 : " +
        scheduleDatas.map((schedule) => schedule.getContent()).join(", ")
      : "";
    return itemsInfo + scheduleInfo;
  }

  /**
   * 오늘 날짜 기준 캘린더 데이터를 추출
   * @param flag 플래그
   * @param userId 유저 id
   * @returns
   */
  private async getTodayCalendarData(flag: boolean, userId: number) {
    const today = getTodayDate();
    if (flag) {
      const calendarDate = await this.calendarService.bringScheduleOrProduct(
        userId,
        today
      );
      return calendarDate;
    }
    return new CalendarDatas([]);
  }
  /**
   * 플래그에 따른 기기값의 푸쉬알림 전송 함수
   * @param engineValue 기기 값
   * @param flagDatas (true, 10번째 방면)
   */
  private async sendPushAlarm(
    engineValue: string,
    flagDatas: string[],
    calendar: string,
    weather: string
  ) {
    flagDatas.map(async (flagData) => {
      const splitData = flagData.split(" ");
      if (splitData[0] === "true") {
        const transportationText =
          splitData[1] === "subway"
            ? `교통수단 : 현재 위치${splitData[3]}, ${splitData[4]} 도착 ${splitData[2]} 전(${splitData[5]}행)`
            : `교통수단 : ${splitData[4]}정류장 ${splitData[5]}번 버스 도착 ${splitData[2]}전`;
        await pushNotice(
          engineValue,
          "GO OUT 알림",
          `${transportationText}\n ${weather} ${calendar}
          `
        );
      }
    });
  }

  /**
   * 5전역, 10분전이 있을 경우 true, 아닐 경우 false 반환 함수
   * @param transportation 도착 시간
   * @returns
   */
  private checkTransportationTime(
    transportation: {
      transportation: string;
      arrival: string;
      busNumber: string;
      stationName: string;
      destination: string;
    }[]
  ) {
    if (transportation !== undefined) {
      const pattern = /\[\s*([35])\s*\]번째|10\s*분|5\s*분/;
      const result = transportation
        .filter((t) => pattern.test(t.arrival))
        .map((t) => {
          const match = t.arrival.match(pattern);
          if (match) {
            const stationInfo = t.arrival.match(/\(.*?\)/)?.[0] || "";
            return t.transportation === "subway"
              ? `true subway ${match[0]} ${stationInfo} ${t.stationName} ${t.destination}`
              : `true bus ${match[0]} ${stationInfo} ${t.stationName} ${t.busNumber}`;
          }
          return null;
        })
        .filter(Boolean);

      return result;
    }
  }

  /**
   * 교통 수단의 정보 조회 함수
   * @param stationResult 역 정보
   * @returns
   */
  private extractTransportationArrivalInfo(stationResult: StationResult) {
    if (
      stationResult.getSubwayStation() === undefined &&
      stationResult.getBusStations() === undefined
    ) {
      return;
    } else if (stationResult.getSubwayStation() === undefined) {
      return this.extractBusArrivalInfo(stationResult.getBusStations());
    } else if (stationResult.getBusStations() === undefined) {
      return this.extractSubwayArrivalInfo(stationResult.getSubwayStation());
    }
  }

  /**
   * 지하철 도착 정보 추출
   * @param subwayStation 지하철역 정보
   * @returns
   */
  private extractSubwayArrivalInfo(subwayStation: SubwayStationResult) {
    return subwayStation.getSubwayArrivalInfo().map((data) => {
      return {
        transportation: "subway",
        subwayStation: subwayStation,
        arrival: data.getFirstArrivalMessage(),
        stationName: data.getStationName(),
        destination: data.getDestination(),
      };
    });
  }

  /**
   * 버스 정류장 정보 추출
   * @param busStations 버스정류장 정보
   * @returns
   */
  private extractBusArrivalInfo(busStations: BusStationResult) {
    return busStations.getBusStationsInfo().flatMap((busStationData) => {
      return busStationData.getBusArrivalInfo().map((data) => {
        return {
          transportation: "bus",
          stationName: data.getStNm(),
          arrival: data.getArrmsg1(),
          busNumber: data.getBusRouteAbrv(),
        };
      });
    });
  }
}
