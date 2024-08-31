import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { TransportationDetailDto } from "./TransportationDetailDto";

export class CollectionInsert {
    @IsNotEmpty()
    private name: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => TransportationDetailDto)
    private goToWork: TransportationDetailDto;

    @ValidateNested()
    @Type(() => TransportationDetailDto)
    private goHome: TransportationDetailDto;

    public getName() {
        return this.name;
    }

    public getGoToWork() {
        return this.goToWork;
    }

    public getGoHome() {
        return this.goHome;
    }
}
