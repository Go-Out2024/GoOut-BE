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
    NotFoundError,
    ForbiddenError,
    BadRequestError,
    InternalServerError,
    Req,

    
} from 'routing-controllers';
import { Service, Container } from 'typedi';
import { TestService } from '../domain/service/TestService.js';
import { TestRequestDto } from '../dto/request/TestRequestDto.js';
import { validate, validateOrReject } from 'class-validator';
import { SuccessResponseDto } from '../../../global/response/SuccessResponseDto.js';
import { TestResponseDto } from '../dto/TestResponseDto.js';


@JsonController('/test')
@Service()
export class TestController {
    constructor(private testService: TestService) {
        this.testService = testService;
    }

    @HttpCode(200)
    @Get()
    public async test(        @Body() testReqeustDto :TestRequestDto
    ): Promise<SuccessResponseDto<TestResponseDto>> {

        // validateOrReject(this.testService);
        return await this.testService.test();
    }

 
}
