
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { SuccessResponseDto } from '../../../../global/response/SuccessResponseDto.js';
import { ErrorResponseDto } from '../../../../global/response/ErrorResponseDto.js';
import { TestErrorCode } from '../../exception/TestErrorCode.js';
import { TestRequestDto } from '../../dto/request/TestRequestDto.js';
import { TestResponseDto } from '../../dto/response/TestResponseDto.js';
import { UserRepository } from '../repository/UserRepository.js';
import { User } from '../entity/User.js';



@Service()
export class TestService {
    constructor(
        @InjectRepository() private userRepository: UserRepository
        ) {}

 
    public async test(
      //  testReqeustDto :TestRequestDto
        ): Promise<SuccessResponseDto<null>> {

        const value =true;
        this.verify(value)

        // const user = User.createUser(
        //     testReqeustDto.getNickname(),
        //     testReqeustDto.getGender(),
        //     testReqeustDto.getPhone()
        // )

       await this.userRepository.save(user);
        return SuccessResponseDto.of(null);
    }


    private verify(value: boolean){
        if(value === false){
            throw  ErrorResponseDto.of(TestErrorCode.ERROR);
     } 
    }
 
}