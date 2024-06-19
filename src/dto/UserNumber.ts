import { User } from "../entity/User";



export class UserNumber{

    constructor(private numbers : string){
        this.numbers
    }

    public static of(data: User):UserNumber {
        return new UserNumber(data.getNumber());
    }
}