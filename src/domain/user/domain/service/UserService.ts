
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { SuccessResponseDto } from '../../../../global/response/SuccessResponseDto.js';
import { ErrorResponseDto } from '../../../../global/response/ErrorResponseDto.js';
import { TestErrorCode } from '../../exception/TestErrorCode.js';
import { TestRequestDto } from '../../dto/TestRequestDto.js';

import { UserRepository } from '../repository/UserRepository.js';
import { User } from '../entity/User.js';
import { UserNumber } from '../../dto/UserNumber.js';



@Service()
export class UserService {
    constructor(
        @InjectRepository() private userRepository: UserRepository
        ) {}


    public async selectUserNumber(
        userId: number
    ): Promise<UserNumber>  {

        const userData : User = await this.userRepository.selectUserById(userId);
        return UserNumber.of(userData);

    }

 



 
}