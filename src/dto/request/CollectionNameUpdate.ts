import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { TransportationDetailDto } from "./TransportationDetailDto.js";

export class CollectionNameUpdate {
    @IsNotEmpty()
    private collectionId: number;

    @IsNotEmpty()
    private name: string;

    public getCollectionId() {
        return this.collectionId;
    }

    public getName() {
        return this.name;
    }

}
