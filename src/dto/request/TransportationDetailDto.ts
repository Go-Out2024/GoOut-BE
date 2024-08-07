import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { StationDto } from "./StationDto.js";

export class TransportationDetailDto {
    @IsNotEmpty()
    private status: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => StationDto)
    private departure: StationDto;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => StationDto)
    private arrival: StationDto;

    public getStatus() {
        return this.status;
    }

    public getDeparture() {
        return this.departure;
    }

    public getArrival() {
        return this.arrival;
    }
}
