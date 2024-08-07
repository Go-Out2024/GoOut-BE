import { IsNotEmpty } from "class-validator";

export class StationDto {
    @IsNotEmpty()
    private name: string;

    @IsNotEmpty()
    private type: string;

    @IsNotEmpty()
    private route: string;

    @IsNotEmpty()
    private numbers: string[];

    public getName() {
        return this.name;
    }

    public getType() {
        return this.type;
    }

    public getRoute() {
        return this.route;
    }

    public getNumbers() {
        return this.numbers;
    }
}
