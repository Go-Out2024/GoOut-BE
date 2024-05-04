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
    // 카카오Id로 사용자 찾기
    public async findByKakaoId(kakaoId: string): Promise<User | undefined> {
        return this.findOne({ where: {kakaoId} });
    }

    // 사용자 정보 생성 및 업데이트
    public async createUser(userData: {kakaoId: string, email: string, phoneNumber: string}): Promise<User> {
        const user = this.create(userData);
        return this.save(user);
    }
 }