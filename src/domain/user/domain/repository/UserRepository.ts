import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User.js';
import { Service } from 'typedi';


/**
 * User DAO Class
 */

@EntityRepository(User)
@Service()
export class UserRepository extends Repository<User> {

    public async selectUserById(userId: number) {
        return await this.findOne({
            where: {
                id: userId
            }
        })
    }
}