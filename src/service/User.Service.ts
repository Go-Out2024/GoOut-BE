
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../repository/User.Repository.js';
import { User } from '../entity/User.js';
import { UserNumber } from '../dto/UserNumber.js';
import { UserEmail } from '../dto/UserEmail.js';
import { FirebaseTokenRepository } from '../repository/FirebaseToken.Repository.js';


@Service()
export class UserService {
    constructor(
        @InjectRepository() private userRepository: UserRepository,
        @InjectRepository() private firebaseTokenRepository: FirebaseTokenRepository
        ) {}

    /**
     * 유저 번호 조회 응용 서비스 함수
     * @param userId 유저 고유 번호
     * @returns 
     */
    public async bringUserNumber(
        userId: number
    ): Promise<UserNumber>  {
        const userData : User = await this.userRepository.findUserById(userId);
        return UserNumber.of(userData);
    }

    /**
     * 유저 이메일 조회 응용 서비스 함수
     * @param userId 유저 고유 번호
     * @returns 
     */
    public async bringUserEmail(
        userId: number
    ): Promise<UserEmail>{
        const userData : User = await this.userRepository.findUserById(userId);
        return UserEmail.of(userData);
    }

    public async saveFirebaseToken(userId: number, token: string): Promise<void> {
        const user = await this.userRepository.findOne({id: userId});
        if (!user) {
            throw new Error("User not found");
        }

        await this.firebaseTokenRepository.saveToken(user, token);
    }

}