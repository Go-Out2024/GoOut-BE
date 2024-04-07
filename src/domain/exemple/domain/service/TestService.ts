
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { SuccessResponseDto } from '../../../../global/response/SuccessResponseDto';
import { ErrorResponseDto } from '../../../../global/response/ErrorResponseDto';
import { TestErrorCode } from '../../exception/TestErrorCode';
import { TestRequestDto } from '../../dto/request/TestRequestDto';
import { TestResponseDto } from '../../dto/response/TestResponseDto';
import { UserRepository } from '../repository/UserRepository';
import { User } from '../entity/User';



@Service()
export class TestService {
    constructor(
        @InjectRepository(User) private userRepository: UserRepository
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

  //      await this.userRepository.save(user);
        return SuccessResponseDto.of(null);
    }


    private verify(value: boolean){
        if(value === false){
            throw  ErrorResponseDto.of(TestErrorCode.ERROR);
     } 
    }
 
}