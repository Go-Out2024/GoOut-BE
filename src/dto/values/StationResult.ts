import { BusStationInfo } from "./BusArrivalInfo.js";
import { SubwayArrivalInfo } from "./SubwayArrivalInfo.js";

export class SubwayStationResult {
    private subwayArrivalInfo: SubwayArrivalInfo[];

    constructor(subwayArrivalInfo: SubwayArrivalInfo[]) {
        this.setSubwayArrivalInfo(subwayArrivalInfo);
    }

    public static of(subwayArrivalInfo: SubwayArrivalInfo[]): SubwayStationResult {
        return new SubwayStationResult(subwayArrivalInfo);
    }

    public setSubwayArrivalInfo(subwayArrivalInfo: SubwayArrivalInfo[]): void {
        this.subwayArrivalInfo = subwayArrivalInfo;
    }

    public getSubwayArrivalInfo(){
        return this.subwayArrivalInfo;
    }
}

export class BusStationResult {
    private busStationsInfo: BusStationInfo[];

    constructor(busStationsInfo: BusStationInfo[]) {
        this.setBusStationsInfo(busStationsInfo);
    }

    public static of(busStationsInfo: BusStationInfo[]): BusStationResult {
        return new BusStationResult(busStationsInfo);
    }

    public setBusStationsInfo(busStationsInfo: BusStationInfo[]): void {
        this.busStationsInfo = busStationsInfo;
    }

    public getBusStationsInfo(){
        return this.busStationsInfo
    }
}

export class StationResult {
    private subwayStation: SubwayStationResult;
    private busStations: BusStationResult;
    private subwayErrorMessage: string

    constructor(subwayStation: SubwayStationResult, busStations: BusStationResult, subwayErrorMessage: string) {
        this.setSubwayStation(subwayStation);
        this.setBusStations(busStations);
        this.setSubwayErrorMessage(subwayErrorMessage)
    }

    public static of(subwayStation: SubwayStationResult, busStations: BusStationResult, subwayErrorMessage: string): StationResult {
        return new StationResult(subwayStation, busStations, subwayErrorMessage);
    }

    public setSubwayStation(subwayStation: SubwayStationResult): void {
        this.subwayStation = subwayStation;
    }

    public setBusStations(busStations: BusStationResult): void {
        this.busStations = busStations;
    }


    public getBusStations(){
        return this.busStations
    }

    public getSubwayStation(){
        return this.subwayStation

    }

    private setSubwayErrorMessage(subwayErrorMessage: string): void {
        this.subwayErrorMessage = subwayErrorMessage;

    }
}
