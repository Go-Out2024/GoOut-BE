import { JsonController, Post, Body, Res, HttpCode, Req, Delete } from "routing-controllers";
import { Request, Response, response } from "express";
import { Service } from "typedi";
import { AuthService } from "../service/Auth.Service.js";
import { ErrorResponseDto } from "../response/ErrorResponseDto.js";
import { SuccessResponseDto } from "../response/SuccessResponseDto.js";
import { ErrorHandler } from "../exception/ErrorHandler.js";
import { refreshToken } from "firebase-admin/app";
import { LogoutDto } from "../dto/request/LogoutDto.js";


@Service()
@JsonController('/auth')
export class AuthController {
    constructor(
        private authService: AuthService,  private errorHandler: ErrorHandler) {}

@HttpCode(200)
@Post('/login')
async login(@Body() body: { accessToken: string},@Req() req:Request, @Res() response: Response) {
    try {
        const as = req.headers.authorization;
        console.log(as);
        const tokens = await this.authService.loginWithKakao(as);
        return response.send(SuccessResponseDto.of(tokens));
    } catch (error) {
        return this.errorHandler.error(error, req, response, () => {});
    }  
}

@HttpCode(200)
@Delete('/logout')
async logout(
    @Body() body: LogoutDto,
    @Req() req: Request, 
    @Res() response: Response) {
    try {
        await this.authService.logout(body.refreshToken, body.firebaseToken);
        return response.send(({message: '로그아웃이 완료되었습니다.'}));
    } catch (error) {
        return this.errorHandler.error(error, req, response, () => {});
    }
}
}