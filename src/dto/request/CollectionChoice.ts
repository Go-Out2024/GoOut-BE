import { IsNotEmpty } from "class-validator";

export class CollectionChoice {
    @IsNotEmpty()
    private collectionId: number;

    public getCollectionId() {
        return this.collectionId;
    }
}
