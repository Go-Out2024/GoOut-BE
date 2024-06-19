import { User } from "../entity/User";

export class UserEmail{
    
    constructor(private email: string){
        this.email
    }

    public static of (user: User): UserEmail{
        return new UserEmail(user.getEmail())

    }
}