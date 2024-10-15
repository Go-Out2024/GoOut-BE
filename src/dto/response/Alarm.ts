export class Alarm {
  public status: boolean;

  constructor(status: boolean) {
    this.setAlarm(status);
  }

  public static of(status: boolean) {
    return new Alarm(status);
  }

  private setAlarm(status: boolean) {
    this.status = status;
  }
}
