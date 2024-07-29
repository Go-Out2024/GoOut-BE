import { IsNotEmpty } from "class-validator";

export class CollectionChange {
    @IsNotEmpty()
    private collectionId: number;

    @IsNotEmpty()
    private status: "goToWork" | "goHome"

    public getCollectionId() {
        return this.collectionId;
    }

    public getStatus() {
        return this.status;
    }
}
