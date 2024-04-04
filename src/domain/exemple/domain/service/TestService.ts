
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { SuccessResponseDto } from '../../../../global/response/SuccessResponseDto';
import { ErrorResponseDto } from '../../../../global/response/ErrorResponseDto';
import { TestErrorCode } from '../../exception/TestErrorCode';
import { TestRequestDto } from '../../dto/request/TestRequestDto';
import { TestResponseDto } from '../../dto/response/TestResponseDto';
import { logger } from '../../../../global/util/logger';


@Service()
export class TestService {
    constructor() {}

 
    public async test(
        testReqeustDto :TestRequestDto
        ): Promise<SuccessResponseDto<TestResponseDto>> {


        const value =true;
        this.verify(value)

        logger.info("HI")
        logger.error("sdf")

        return SuccessResponseDto.of(TestResponseDto.of(
            testReqeustDto.getNickname(),
            testReqeustDto.getProfileImage(),
            testReqeustDto.getPhone()
            ));

    }


    private verify(value: boolean){
        if(value === false){
            throw  ErrorResponseDto.of(TestErrorCode.ERROR);
     } 
    }
 
}