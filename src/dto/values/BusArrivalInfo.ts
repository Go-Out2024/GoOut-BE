export class Station {
    private id: number;
    private stationName: string;

    constructor(
        id: number, 
        stationName: string
    ) {
        this.setId(id);
        this.setStationName(stationName);
    }
    
    public setId(id: number) {
        this.id = id;
    }

    public setStationName(stationName: string) {
        this.stationName = stationName;
    }
}

export class BusStationInfo {
    private station: Station;
    private busArrivalInfo: BusArrivalInfo[];

    constructor(
        station: Station, 
        busArrivalInfo: BusArrivalInfo[]
    ) {
        this.setStation(station);
        this.setBusArrivalInfo(busArrivalInfo);
    }

    public static of(station: Station, busArrivalInfo: BusArrivalInfo[]): BusStationInfo {
        return new BusStationInfo(station, busArrivalInfo);
    }

    public setStation(station: Station) {
        this.station = station;
    }

    public setBusArrivalInfo(busArrivalInfo: BusArrivalInfo[]) {
        this.busArrivalInfo = busArrivalInfo;
    }
}


export class BusArrivalInfo {
    private nxtStn: string;
    private busRouteAbrv: string;
    private arrmsg1: string;
    private arrmsg2: string;

    constructor(
        nxtStn: string,
        busRouteAbrv: string,
        arrmsg1: string,
        arrmsg2: string,
    ) {
        this.setNxtStn(nxtStn);
        this.setBusRouteAbrv(busRouteAbrv);
        this.setArrmsg1(arrmsg1);
        this.setArrmsg2(arrmsg2);
    }

    public static of(
        busArrivalInfo: BusArrivalInfo
    ) {
        return new BusArrivalInfo(
            busArrivalInfo.nxtStn,
            busArrivalInfo.busRouteAbrv,
            busArrivalInfo.arrmsg1,
            busArrivalInfo.arrmsg2
        )
    }


    public static fromData(item: { nxtStn: string; busRouteAbrv: string; arrmsg1: string; arrmsg2: string; }): BusArrivalInfo {
        return new BusArrivalInfo(
            item.nxtStn || '정보 없음.',
            item.busRouteAbrv || '정보 없음.',
            item.arrmsg1 || '정보 없음.',
            item.arrmsg2 || '정보 없음.'
        );
    }

    public setNxtStn(nxtStn: string) {
        this.nxtStn = nxtStn;
    }

    public setBusRouteAbrv(busRouteAbrv: string) {
        this.busRouteAbrv = busRouteAbrv;
    }

    public setArrmsg1(arrmsg1: string) {
        this.arrmsg1 = arrmsg1;
    }

    public setArrmsg2(arrmsg2: string) {
        this.arrmsg2 = arrmsg2;
    }
}
