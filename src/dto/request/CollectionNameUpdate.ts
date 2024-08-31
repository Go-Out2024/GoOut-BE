import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";

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
