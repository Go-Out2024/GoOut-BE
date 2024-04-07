import {
    JsonController,
    Get,
    HttpCode,
    Body,
} from 'routing-controllers';
import { Service } from 'typedi';
import { TestService } from '../domain/service/TestService.js';
import { TestRequestDto } from '../dto/request/TestRequestDto.js';
import { SuccessResponseDto } from '../../../global/response/SuccessResponseDto.js';


@JsonController('/test')
@Service()
export class TestController {
    constructor( 
        private testService: TestService
    ) {}


    @HttpCode(200)
    @Get()
    @UseBefore(compareAuthToken)
    public async test( 
     //   @Body({validate:true}) testReqeustDto :TestRequestDto,
        @Req() req:Request
    ): Promise<SuccessResponseDto<null>> {

      //  console.log(res)

        return await this.testService.test(
           // testReqeustDto
            );
    }

}

 

