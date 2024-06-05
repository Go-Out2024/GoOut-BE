import { EntityRepository, Repository } from 'typeorm';
import { FirebaseToken } from '../entity/FirebaseToken.js';
import { User } from '../entity/User.js';

@EntityRepository(FirebaseToken)
export class FirebaseTokenRepository extends Repository<FirebaseToken> {
    public async saveToken(user: User, token: string): Promise<FirebaseToken> {
        const firebaseToken = this.create({ user, token });
        return this.save(firebaseToken);
    }
}