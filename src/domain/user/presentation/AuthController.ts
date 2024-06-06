import { JsonController, Post, Body, Res, HttpCode, Req, Delete } from "routing-controllers";
import { Request, Response, response } from "express";
import { Service } from "typedi";
import { AuthService } from "../domain/service/AuthService.js";
import { ErrorResponseDto } from "../../../global/response/ErrorResponseDto.js";
import { SuccessResponseDto } from "../../../global/response/SuccessResponseDto.js";
import { ErrorHandler } from "../../../global/exception/ErrorHandler.js";

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
async logout(@Body() body: {refreshToken: string}, @Req() req: Request, @Res() response: Response) {
    try {
        const rs = req.headers.authorization;
        console.log(rs);
        await this.authService.logout(rs);
        return response.send(({message: '로그아웃이 완료되었습니다.'}));
    } catch (error) {
        return this.errorHandler.error(error, req, response, () => {});
    }
}
}