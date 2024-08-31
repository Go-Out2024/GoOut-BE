export class SubwayArrivalInfo {
    private stationName: string;
    private line: number;
    private direction: string;
    private firstArrivalMessage: string;
    private secondArrivalMessage: string;
    private destination: string;
    private estimatedTime: string;

    constructor(
        stationName: string,
        line: number,
        direction: string,
        firstArrivalMessage: string,
        secondArrivalMessage: string,
        destination: string,
        estimatedTime: string
    ) {
        this.setStationName(stationName);
        this.setLine(line);
        this.setDirection(direction);
        this.setFirstArrivalMessage(firstArrivalMessage);
        this.setSecondArrivalMessage(secondArrivalMessage);
        this.setDestination(destination);
        this.setEstimatedTime(estimatedTime);
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
            subwayArrivalInfo.destination,
            subwayArrivalInfo.estimatedTime
        )
    }
    
    public static fromData(info: { 
        statnNm: string; 
        subwayId: number; 
        trainLineNm: string; 
        arvlMsg2: string; 
        arvlMsg3: string; 
        bstatnNm: string;
        barvlDt: number; }): SubwayArrivalInfo {

        // 초 단위를 '분', '초' 형식으로 변환
        const minutes = Math.floor(info.barvlDt / 60);
        const seconds = info.barvlDt % 60;
        const estimatedTime = `${minutes}분 ${seconds}초`;
        
        return new SubwayArrivalInfo(
            info.statnNm,
            info.subwayId,
            info.trainLineNm,
            info.arvlMsg2,
            info.arvlMsg3,
            info.bstatnNm,
            estimatedTime
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

    public getFirstArrivalMessage(){
        return this.firstArrivalMessage;
    }

    public getSecondArrivalMessage(){
        return this.secondArrivalMessage;

    }

    
    public setEstimatedTime(estimatedTime: string) {
        this.estimatedTime = estimatedTime;

    }
}
