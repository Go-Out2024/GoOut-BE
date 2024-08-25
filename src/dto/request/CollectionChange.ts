import { IsNotEmpty } from "class-validator";

export class CollectionChange {

    @IsNotEmpty()
    private status: "goToWork" | "goHome"

    public getStatus() {
        return this.status;
    }
}
