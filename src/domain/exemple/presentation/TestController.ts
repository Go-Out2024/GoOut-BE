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
    Req,
    BadRequestError,

    
} from 'routing-controllers';
import { Service, Container } from 'typedi';
import { TestService } from '../domain/service/TestService.js';
import { TestRequestDto } from '../dto/request/TestRequestDto.js';
import { ValidationError, validate, validateOrReject } from 'class-validator';
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
    public async test( 
        @Body() testReqeustDto :TestRequestDto
    ): Promise<SuccessResponseDto<TestResponseDto>> {
      //  const errors = await validateOrReject(testReqeustDto);

     //  this.valideCheck(errors);


        return await this.testService.test(testReqeustDto);
    }

    private valideCheck(errors: ValidationError[]){
        if (errors.length > 0) {
            // 유효성 검사 오류가 있는 경우 처리
            throw new BadRequestError('Validation failed: ' + errors.join(', '));
        }
    }
}

 

