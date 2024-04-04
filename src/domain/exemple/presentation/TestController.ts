import {
    JsonController,
    Get,
    Put,
    Post,
    Delete,
    HttpCode,
    Param,
    Body,
    Res,
    UseBefore,
    Req 
} from 'routing-controllers';
import { Service } from 'typedi';
import { TestService } from '../domain/service/TestService.js';
import { TestRequestDto } from '../dto/request/TestRequestDto.js';
import { SuccessResponseDto } from '../../../global/response/SuccessResponseDto.js';
import { TestResponseDto } from '../dto/response/TestResponseDto.js';


@JsonController('/test')
@Service()
export class TestController {
    constructor(private testService: TestService) {
        this.testService = testService;
    }

    @HttpCode(200)
    @Get()
    public async test( 
        @Body({validate:true}) testReqeustDto :TestRequestDto
    ): Promise<SuccessResponseDto<null>> {

        return await this.testService.test(testReqeustDto);
    }

}

 

