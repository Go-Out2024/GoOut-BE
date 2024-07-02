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
import { SuccessResponseDto } from '../response/SuccessResponseDto.js';
import { compareAuthToken } from '../middleware/jwtMiddleware.js';
import { Request } from 'express';
import { UserService } from '../service/User.Service.js';
import { UserNumber } from '../dto/UserNumber.js';
import { UserEmail } from '../dto/UserEmail.js';
import { FirebaseTokenDto } from '../dto/request/FirebaseTokenDto.js';



@JsonController("/user")
@Service()
export class UserController {
    constructor( 
        private userService: UserService
    ) {}

    /**
     * 유저 번호를 조회 함수
     * @param req 
     * @returns 
     */
    @HttpCode(200)
    @Get("/number")
    @UseBefore(compareAuthToken)
    public async bringUserNumber( 
        @Req() req:Request
    ): Promise<SuccessResponseDto<UserNumber>> {
   
        const result = await this.userService.bringUserNumber(req.decoded.id);
        return SuccessResponseDto.of(result);
   
    }

    /**
     * 유저 이메일 조회 함수
     * @param req 
     * @returns 
     */
    @HttpCode(200)
    @Get("/email")
    @UseBefore(compareAuthToken)
    public async bringUserEmail( 
        @Req() req:Request
    ): Promise<SuccessResponseDto<UserEmail>> {
   
        const result = await this.userService.bringUserEmail(req.decoded.id);
        return SuccessResponseDto.of(result);
   
    }
    
    @HttpCode(200)
    @Post("/firebase-token")
    @UseBefore(compareAuthToken)
    public async saveFirebaseToken(
        @Req() req: Request,
        @Body() body: FirebaseTokenDto 
    ): Promise<SuccessResponseDto<null>> {
        await this.userService.saveFirebaseToken(req.decoded.id, body.token);
        return SuccessResponseDto.of(null);

    }


}

 

