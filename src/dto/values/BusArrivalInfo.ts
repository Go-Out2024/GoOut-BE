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
    
    private setId(id: number) {
        this.id = id;
    }

    private setStationName(stationName: string) {
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

    private setStation(station: Station) {
        this.station = station;
    }

    private setBusArrivalInfo(busArrivalInfo: BusArrivalInfo[]) {
        this.busArrivalInfo = busArrivalInfo;
    }

    public getBusArrivalInfo(){
        return this.busArrivalInfo
    }
}


export class BusArrivalInfo {

    private stNm: string;
    private nxtStn: string;
    private busRouteAbrv: string;
    private arrmsg1: string;
    private arrmsg2: string;

    constructor(
        stNm: string,
        nxtStn: string,
        busRouteAbrv: string,
        arrmsg1: string,
        arrmsg2: string,
    ) {
        this.setstNm(stNm);
        this.setNxtStn(nxtStn);
        this.setBusRouteAbrv(busRouteAbrv);
        this.setArrmsg1(arrmsg1);
        this.setArrmsg2(arrmsg2);
    }

    public static of(
        busArrivalInfo: BusArrivalInfo
    ) {
        return new BusArrivalInfo(
            busArrivalInfo.stNm,
            busArrivalInfo.nxtStn,
            busArrivalInfo.busRouteAbrv,
            busArrivalInfo.arrmsg1,
            busArrivalInfo.arrmsg2
        )
    }


    public static fromData(item: { stNm:string, nxtStn: string; busRouteAbrv: string; arrmsg1: string; arrmsg2: string; }): BusArrivalInfo {
        return new BusArrivalInfo(
            item.stNm || '정보 없음.',
            item.nxtStn || '정보 없음.',
            item.busRouteAbrv || '정보 없음.',
            item.arrmsg1 || '정보 없음.',
            item.arrmsg2 || '정보 없음.'
        );
    }

    private setstNm(stNm: string) {
        this.stNm = stNm;
    }

    private setNxtStn(nxtStn: string) {
        this.nxtStn = nxtStn;
    }

    private setBusRouteAbrv(busRouteAbrv: string) {
        this.busRouteAbrv = busRouteAbrv;
    }

    private setArrmsg1(arrmsg1: string) {
        this.arrmsg1 = arrmsg1;
    }

    private setArrmsg2(arrmsg2: string) {
        this.arrmsg2 = arrmsg2;
    }

    public getArrmsg1(){
        return this.arrmsg1;
    }

    public getBusRouteAbrv(){
        return this.busRouteAbrv;
    }
}
