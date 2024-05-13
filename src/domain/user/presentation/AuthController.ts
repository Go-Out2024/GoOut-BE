import { JsonController, Post, Body, Res, HttpCode, Req } from "routing-controllers";
import { Request, Response, response } from "express";
import { Service } from "typedi";
import { AuthService } from "../domain/service/AuthService.js";


@Service()
@JsonController('/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

@HttpCode(200)
@Post('/login')
async login(@Body() body: { accessToken: string},@Req() req:Request, @Res() response: Response) {
    try {
        const as = req.headers.authorization;
        console.log(as);
        const tokens = await this.authService.loginWithKakao(as);
        return response.send(tokens);
    } catch (error) {
        return response.status(400).send({ message: '로그인 실패', error: error.message});
    }
    
}

@HttpCode(200)
@Post('/logout')
async logout(@Body() body: {refreshToken: string}, @Req() req: Request, @Res() response: Response) {
    try {
        const rs = req.headers.authorization;
        console.log(rs);
        await this.authService.logout(rs);
        return response.send({message: '로그아웃이 완료되었습니다.'});
    } catch (error) {
        return response.status(400).send({ message: '로그아웃을 실패하였습니다. ', error: error.message});
    }
}
}