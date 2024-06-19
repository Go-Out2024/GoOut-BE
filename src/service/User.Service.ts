
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { SuccessResponseDto } from '../response/SuccessResponseDto.js';
import { ErrorResponseDto } from '../response/ErrorResponseDto.js';
import { TestErrorCode } from '../exception/TestErrorCode.js';
import { TestRequestDto } from '../dto/TestRequestDto.js';

import { UserRepository } from '../repository/User.Repository.js';
import { FirebaseToken } from '../entity/FirebaseToken.js';
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


    public async selectUserNumber(
        userId: number
    ): Promise<UserNumber>  {

        const userData : User = await this.userRepository.selectUserById(userId);
        return UserNumber.of(userData);

    }

    public async selectUserEmail(
        userId: number
    ): Promise<UserEmail>{
        const userData : User = await this.userRepository.selectUserById(userId);
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