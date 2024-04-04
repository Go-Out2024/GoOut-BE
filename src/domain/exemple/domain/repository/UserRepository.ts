import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User.js';
import { Service } from 'typedi';


/**
 * User DAO Class
 */
@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {}