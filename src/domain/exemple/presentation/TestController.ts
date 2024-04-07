

import {
    JsonController,
    Get,
    HttpCode,
    Body,
    Res,
    Req,
    UseBefore
} from 'routing-controllers';
import { Service } from 'typedi';

import { TestService } from '../domain/service/TestService.js';
import { TestRequestDto } from '../dto/request/TestRequestDto.js';
import { SuccessResponseDto } from '../../../global/response/SuccessResponseDto.js';
import { compareAuthToken } from '../../../global/middleware/jwtMiddleware.js';
import { Request } from 'express';



  


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
        @Body({validate:true}) testReqeustDto :TestRequestDto,
         @Req() req:Request
    ): Promise<SuccessResponseDto<null>> {

         const userId : number = req.decoded.id;
         console.log(userId)
         console.log(2)


        return await this.testService.test(
            testReqeustDto
            );
    }

}

 

