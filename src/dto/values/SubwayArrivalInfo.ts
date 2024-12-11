export class SubwayArrivalInfo {
  private stationName: string;
  private line: string;
  private direction: string;
  private firstArrivalMessage: string;
  private secondArrivalMessage: string;
  private destination: string;
  private estimatedTime: string;

  constructor(
    stationName: string,
    line: string,
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

  public static of(subwayArrivalInfo: SubwayArrivalInfo) {
    return new SubwayArrivalInfo(
      subwayArrivalInfo.stationName,
      subwayArrivalInfo.line,
      subwayArrivalInfo.direction,
      subwayArrivalInfo.firstArrivalMessage,
      subwayArrivalInfo.secondArrivalMessage,
      subwayArrivalInfo.destination,
      subwayArrivalInfo.estimatedTime
    );
  }

  public static fromData(info: {
    statnNm: string;
    subwayId: string;
    trainLineNm: string;
    arvlMsg2: string;
    arvlMsg3: string;
    bstatnNm: string;
    barvlDt: number;
  }): SubwayArrivalInfo | null {

    const match = info.arvlMsg2.match(/\[(\d+)\]/);
    if (match && parseInt(match[1], 10) >= 20) {
    
        return null;
    }
    // (~행 - ~방면)에서 (~방면)으로 변환
    const direction = info.trainLineNm.split(" - ")[1];
    // 초 단위를 '분', '초' 형식으로 변환
    const minutes = Math.floor(info.barvlDt / 60);
    const seconds = info.barvlDt % 60;
    const estimatedTime = `${minutes}분 ${seconds}초`;

    return new SubwayArrivalInfo(
      info.statnNm,
      info.subwayId,
      direction,
      info.arvlMsg2,
      info.arvlMsg3,
      info.bstatnNm,
      estimatedTime
    );
  }

  private setStationName(stationName: string) {
    this.stationName = stationName;
  }

  private setLine(line: string) {
    this.line = line;
  }

  private setDirection(direction: string) {
    this.direction = direction;
  }

  private setFirstArrivalMessage(firstArrivalMessage: string) {
    this.firstArrivalMessage = firstArrivalMessage;
  }

  private setSecondArrivalMessage(secondArrivalMessage: string) {
    this.secondArrivalMessage = secondArrivalMessage;
  }

  private setDestination(destination: string) {
    this.destination = destination;
  }

  private setEstimatedTime(estimatedTime: string) {
    this.estimatedTime = estimatedTime;
  }

  public getFirstArrivalMessage() {
    return this.firstArrivalMessage;
  }

  public getSecondArrivalMessage() {
    return this.secondArrivalMessage;
  }

  public getStationName() {
    return this.stationName;
  }

  public getLine() {
    return this.line;
  }

  public getDestination() {
    return this.destination;
  }
}
