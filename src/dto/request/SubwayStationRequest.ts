import { IsNotEmpty } from "class-validator";

export class SubwayStationRequest {

    @IsNotEmpty()
    private subwayName: string;

    public getSubwayName() {
        return this.subwayName;
    }
}
