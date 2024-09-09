import { JsonController, Post, Body, Res, HttpCode, Req, Delete } from "routing-controllers";
import { Request, Response, response } from "express";
import { Service } from "typedi";
import { AuthService } from "../service/Auth.Service";
import { SuccessResponseDto } from "../response/SuccessResponseDto";
import { ErrorHandler } from "../exception/ErrorHandler";
import { LogoutDto } from "../dto/request/LogoutDto";


@Service()
@JsonController('/auth')
export class AuthController {
    constructor(
        private authService: AuthService,  private errorHandler: ErrorHandler) {}

@HttpCode(200)
@Post('/login')
async login(
    @Req() req:Request, 
    @Res() response: Response) {
        const accessToken = req.headers.authorization;
        const tokens = await this.authService.loginWithKakao(accessToken);
        return response.send(SuccessResponseDto.of(tokens));
}

@HttpCode(200)
@Delete('/logout')
async logout(
    @Body() body: LogoutDto,
    @Res() response: Response) {    
        await this.authService.logout(body.refreshToken, body.firebaseToken);
        return response.send(({message: '로그아웃이 완료되었습니다.'}));
}
}