import { IsNotEmpty } from "class-validator";

export class BusStationRequest {

    @IsNotEmpty()
    private stationName: string;

    @IsNotEmpty()
    private busStationId: number;

    public getStationName() {
        return this.stationName;
    }

    public getBusStationId() {
        return this.busStationId
    }
}
