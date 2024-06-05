import {
    JsonController,
    Get,
    HttpCode,
    Param,
    Body,
    Res,
    Req,
    UseBefore,
    Post
} from 'routing-controllers';
import { Service, Token } from 'typedi';
import { SuccessResponseDto } from '../../../global/response/SuccessResponseDto.js';
import { compareAuthToken } from '../../../global/middleware/jwtMiddleware.js';
import { Request } from 'express';
import { UserService } from '../domain/service/UserService.js';
import { UserNumber } from '../dto/UserNumber.js';
import { UserEmail } from '../dto/UserEmail.js';



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


    @HttpCode(200)
    @Get("/email")
    @UseBefore(compareAuthToken)
    public async selectUserEmail( 
        @Req() req:Request
    ): Promise<SuccessResponseDto<UserEmail>> {
   
        const result = await this.userService.selectUserEmail(req.decoded.id);
        return SuccessResponseDto.of(result);
   
    }
    
    @HttpCode(200)
    @Post("/firebase-token")
    @UseBefore(compareAuthToken)
    public async saveFirebaseToken(
        @Req() req: Request,
        @Body() body: { token: string }
    ): Promise<SuccessResponseDto<null>> {
        await this.userService.saveFirebaseToken(req.decoded.id, body.token);
        return SuccessResponseDto.of(null);

    }


}

 

