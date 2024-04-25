import { User } from "../domain/entity/User";



export class UserNumber{

    constructor(private numbers : string){
        this.numbers
    }

    public static of(data: User):UserNumber {
        return new UserNumber(data.getNumber());
    }
}