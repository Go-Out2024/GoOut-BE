import { JsonController, Post, Body, Res, Req, HttpCode } from "routing-controllers";
import { Response, Request } from "express";
import { Service } from "typedi";
import { TokenService } from "../domain/service/TokenService.js";
import { Http } from "winston/lib/winston/transports";

@Service()
@JsonController('/auth')
export class TokenController {
    constructor(private tokenService: TokenService) {}

@HttpCode(200)
@Post('/refresh-token')
async refreshToken(@Req() req: Request, @Res() response: Response) {
    const refreshToken = req.headers.authorization?.split(' ')[1]; //Bearer token
    if(!refreshToken) {
        return response.status(401).send({message: "refreshToken이 필요합니다. "});
    }

    try {
        const newTokens = await this.tokenService.refreshToken(refreshToken);
        return response.send(newTokens);
    } catch (error) {
        return response.status(400).send({ message: "새로운 토큰 발급 실패" });
    }
}

}