import { EntityRepository, Repository } from 'typeorm';
import { FirebaseToken } from '../entity/FirebaseToken';
import { User } from '../entity/User';

@EntityRepository(FirebaseToken)
export class FirebaseTokenRepository extends Repository<FirebaseToken> {
    public async insertToken(user: User, token: string): Promise<FirebaseToken> {
        const existingToken = await this.createQueryBuilder("firebaseToken")
            .where("firebaseToken.user.id = :userId", { userId: user.id})
            .andWhere("firebaseToken.token = :token", { token })
            .getOne();
        if (existingToken) {
            return;
        }
        const firebaseToken = this.create({ user, token });
        return this.save(firebaseToken);
    }

    public async deleteTokensByUserId(userId: number, firebaseToken: string): Promise<void> {
        await this.createQueryBuilder()
        .delete()
        .from(FirebaseToken)
        .where("user.id = :userId AND token = :token", {userId, token: firebaseToken})
        .execute()
    }

    public async findTokenByUserId(userId: number): Promise<FirebaseToken | undefined> {
        return this.createQueryBuilder("firebaseToken")
            .where("firebaseToken.user.id = :userId", { userId })
            .getOne();
    }
}