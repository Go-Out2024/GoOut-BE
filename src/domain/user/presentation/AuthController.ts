import { JsonController, Post, Body, Res, HttpCode } from "routing-controllers";
import { Response, response } from "express";
import { Service } from "typedi";
import { AuthService } from "../domain/service/AuthService";


@Service()
@JsonController('/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

@HttpCode(200)
@Post('/login')
async login(@Body() body: { accessToken: string}, @Res() response: Response) {
    try {
        const tokens = await this.authService.loginWithKakao(body.accessToken);
        return response.send(tokens);
    } catch (error) {
        response.status(400).send({ message: '로그인 실패', error: error.message});
    }

}

@HttpCode(200)
@Post('/logout')
async logout(@Body() body: {refreshToken: string}, @Res() response: Response) {
    try {
        await this.authService.logout(body.refreshToken);
        response.send({message: '로그아웃이 완료되었습니다.'});
    } catch (error) {
        response.status(400).send({ message: '로그아웃을 실패하였습니다. ', error: error.message});
    }
}
}