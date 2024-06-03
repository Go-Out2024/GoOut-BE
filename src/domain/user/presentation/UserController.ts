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
import { SaveTokenDTO } from '../dto/SaveTokenDto.js';



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
    @Post("/:id/token")
    public async saveFirebaseToken(
        @Param('id') id: number,
        @Body() body: SaveTokenDTO
    ): Promise<SuccessResponseDto<void>> {
        await this.userService.saveFirebaseToken(id, body.token);
        return SuccessResponseDto.of();

    }


}

 

