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
import { SuccessResponseDto } from '../../../global/response/SuccessResponseDto.js';
import { compareAuthToken } from '../../../global/middleware/jwtMiddleware.js';
import { Request } from 'express';
import { UserService } from '../domain/service/UserService.js';
import { UserNumber } from '../dto/UserNumber.js';




@JsonController("/user")
@Service()
export class UserController {
    constructor( 
        private userService: UserService
    ) {}


    @HttpCode(200)
    @Get("/number")
    @UseBefore(compareAuthToken)
    public async selectUserNumber( 
        @Req() req:Request
    ): Promise<SuccessResponseDto<UserNumber>> {
   
        const result = await this.userService.selectUserNumber(req.decoded.id);
        return SuccessResponseDto.of(result);
   
    }


}

 

