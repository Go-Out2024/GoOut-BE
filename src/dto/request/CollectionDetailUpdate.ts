import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { TransportationDetailDto } from "./TransportationDetailDto.js";

export class CollectionDetailUpdate {
    @IsNotEmpty()
    private collectionId: number;


    @ValidateNested()
    @Type(() => TransportationDetailDto)
    private goToWork: TransportationDetailDto;

    @ValidateNested()
    @Type(() => TransportationDetailDto)
    private goHome: TransportationDetailDto;

    public getCollectionId() {
        return this.collectionId;
    }

    public getGoToWork() {
        return this.goToWork;
    }

    public getGoHome() {
        return this.goHome;
    }
}
