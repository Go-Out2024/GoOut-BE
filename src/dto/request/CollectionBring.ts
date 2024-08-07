import { IsNotEmpty } from "class-validator";

export class CollectionBring {
    @IsNotEmpty()
    private collectionId: number;

    public getCollectionId() {
        return this.collectionId;
    }
}
