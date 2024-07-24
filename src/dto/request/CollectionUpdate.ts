import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { TransportationDetailDto } from "./TransportationDetailDto.js";

export class CollectionUpdate {
    @IsNotEmpty()
    private collectionId: number;

    @IsNotEmpty()
    private name: string;

    @ValidateNested()
    @Type(() => TransportationDetailDto)
    private goToWork: TransportationDetailDto;

    @ValidateNested()
    @Type(() => TransportationDetailDto)
    private goHome: TransportationDetailDto;

    public getCollectionId() {
        return this.collectionId;
    }

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
