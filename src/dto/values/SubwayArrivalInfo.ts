export class SubwayArrivalInfo {
    private stationName: string;
    private line: number;
    private direction: string;
    private firstArrivalMessage: string;
    private secondArrivalMessage: string;
    private destination: string;

    constructor(
        stationName: string,
        line: number,
        direction: string,
        firstArrivalMessage: string,
        secondArrivalMessage: string,
        destination: string
    ) {
        this.setStationName(stationName);
        this.setLine(line);
        this.setDirection(direction);
        this.setFirstArrivalMessage(firstArrivalMessage);
        this.setSecondArrivalMessage(secondArrivalMessage);
        this.setDestination(destination);
    }

    public static of(
        subwayArrivalInfo:SubwayArrivalInfo
    ) {
        return new SubwayArrivalInfo(
            subwayArrivalInfo.stationName,
            subwayArrivalInfo.line,
            subwayArrivalInfo.direction,
            subwayArrivalInfo.firstArrivalMessage,
            subwayArrivalInfo.secondArrivalMessage,
            subwayArrivalInfo.destination
        )
    }
    
    public static fromData(info: { statnNm: string; subwayId: number; trainLineNm: string; arvlMsg2: string; arvlMsg3: string; bstatnNm: string; }): SubwayArrivalInfo {
        return new SubwayArrivalInfo(
            info.statnNm,
            info.subwayId,
            info.trainLineNm,
            info.arvlMsg2,
            info.arvlMsg3,
            info.bstatnNm
        );
    }

    public setStationName(stationName: string) {
        this.stationName = stationName;
    }

    public setLine(line: number) {
        this.line = line;
    }

    public setDirection(direction: string) {
        this.direction = direction;
    }

    public setFirstArrivalMessage(firstArrivalMessage: string) {
        this.firstArrivalMessage = firstArrivalMessage;
    }

    public setSecondArrivalMessage(secondArrivalMessage: string) {
        this.secondArrivalMessage = secondArrivalMessage;
    }

    public setDestination(destination: string) {
        this.destination = destination;
    }
}
