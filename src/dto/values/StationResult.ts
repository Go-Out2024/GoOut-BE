import { BusStationInfo } from "./BusArrivalInfo";
import { SubwayArrivalInfo } from "./SubwayArrivalInfo";

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
}

export class StationResult {
    private subwayStation: SubwayStationResult;
    private busStations: BusStationResult;

    constructor(subwayStation: SubwayStationResult, busStations: BusStationResult) {
        this.setSubwayStation(subwayStation);
        this.setBusStations(busStations);
    }

    public static of(subwayStation: SubwayStationResult, busStations: BusStationResult): StationResult {
        return new StationResult(subwayStation, busStations);
    }

    public setSubwayStation(subwayStation: SubwayStationResult): void {
        this.subwayStation = subwayStation;
    }

    public setBusStations(busStations: BusStationResult): void {
        this.busStations = busStations;
    }
}
