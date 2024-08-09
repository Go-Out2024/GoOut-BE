import { IsNotEmpty } from "class-validator";

export class CollectionErase {
    @IsNotEmpty()
    private collectionId: number;

    public getCollectionId() {
        return this.collectionId;
    }
}
