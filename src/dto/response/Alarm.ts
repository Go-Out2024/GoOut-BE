export class Alarm {
  public status: boolean;
  public startTime: string;
  public endTime: string;

  constructor(status?: boolean, startTime?: string, endTime?: string) {
    this.setAlarm(status);
    this.setStartTime(startTime);
    this.setEndTime(endTime);
  }

  public static of(status?: boolean, startTime?: string, endTime?: string) {
    return new Alarm(status, startTime, endTime);
  }

  private setAlarm(status: boolean) {
    this.status = status;
  }

  private setStartTime(startTime: string) {
    this.startTime = startTime;
  }

  private setEndTime(endTime: string) {
    this.endTime = endTime;
  }
}
