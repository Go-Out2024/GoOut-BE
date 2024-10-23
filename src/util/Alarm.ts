import { Service } from "typedi";
import { TrafficService } from "../service/Traffic.Service";
import {
  BusStationResult,
  StationResult,
  SubwayStationResult,
} from "../dto/values/StationResult";
import { pushNotice } from "./firebaseMessage";

@Service()
export class Alarm {
  constructor(private readonly trafficService: TrafficService) {}

  /**
   * 유저 정보에 따른 알림 전송 함수
   * @param datas 유저 정보
   */
  public async handleAlarm(datas: any[]) {
    await Promise.all(
      datas.map(async (data: any) => {
        const transportationData =
          await this.trafficService.bringMainTrafficCollection(data.user_id);
        const arrivalDatas = this.extractTransportationArrivalInfo(
          transportationData.result
        );
        const flagDatas = this.checkTransportationTime(arrivalDatas);
        await this.sendPushAlarm(data.token, flagDatas);
      })
    );
  }

  /**
   * 플래그에 따른 기기값의 푸쉬알림 전송 함수
   * @param engineValue 기기 값
   * @param flag 플래그
   */
  private async sendPushAlarm(
    engineValue: string,
    flagDatas: string[]
    // location: string,
    // arrival: string
  ) {
    flagDatas.map(async (flagData) => {
      const splitData = flagData.split(" ");
      if (splitData[0] === "true")
        await pushNotice(
          engineValue,
          "교통수단 알림",
          `등록하신 교통수단의 도착 시간이 ${splitData[2]}역방면 ${splitData[1]} 전입니다.`
        );
    });
  }

  /**
   * 5전역, 10분전이 있을 경우 true, 아닐 경우 false 반환 함수
   * @param time 도착 시간
   * @returns
   */
  private checkTransportationTime(time: string[]) {
    if (time !== undefined) {
      const pattern = /\[\s*([35])\s*\]번째|10\s*분|5\s*분/;
      const result = time
        .filter((t) => pattern.test(t))
        .map((t) => {
          const match = t.match(pattern);
          if (match) {
            const stationInfo = t.match(/\(.*?\)/)?.[0] || "";
            return `true ${match[0]} ${stationInfo}`;
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
      return data.getFirstArrivalMessage();
    });
  }

  /**
   * 버스 정류장 정보 추출
   * @param busStations 버스정류장 정보
   * @returns
   */
  private extractBusArrivalInfo(busStations: BusStationResult) {
    return busStations.getBusStationsInfo().flatMap((busStationData) => {
      return busStationData
        .getBusArrivalInfo()
        .map((data) => data.getArrmsg1());
    });
  }
}
