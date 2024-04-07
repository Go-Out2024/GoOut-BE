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
import { compareAuthToken } from '../../../global/middleware/jwtMiddleware.js';
import { createRequire } from 'module';
import { Response } from 'express';
// const require = createRequire(import.meta.url);
// const express = require('express');
// const { Request } = express;

@JsonController('/test')
@Service()
export class TestController {
    constructor(private testService: TestService) {
        this.testService = testService;
    }


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

 

