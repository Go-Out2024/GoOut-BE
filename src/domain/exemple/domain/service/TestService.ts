
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { SuccessResponseDto } from '../../../../global/response/SuccessResponseDto';
import { ErrorResponseDto } from '../../../../global/response/ErrorResponseDto';
import { ErrorCode } from '../../../../global/exception/ErrorCode';
import { TestRequestDto } from '../../dto/request/TestRequestDto';
import { TestResponseDto } from '../../dto/TestResponseDto';


@Service()
export class TestService {
    constructor() {}

 
    public async test(
        testReqeustDto :TestRequestDto
        ): Promise<SuccessResponseDto<TestResponseDto>> {


        const value =false;
        this.verify(value)

        const data = TestResponseDto.builder(
            testReqeustDto.getNickname(),
            testReqeustDto.getProfileImage(),
            testReqeustDto.getPhone()
            )

        return SuccessResponseDto.of(data);

    }


    private verify(value: boolean){
        if(value === false){
            throw  ErrorResponseDto.of(ErrorCode.ERROR);
     } 
    }
 
}