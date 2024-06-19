import { JsonController, Post, Body, Res, Req, HttpCode } from "routing-controllers";
import { Response, Request } from "express";
import { Service } from "typedi";
import { TokenService } from "../service/Token.Service.js";
import { Http } from "winston/lib/winston/transports";
import { SuccessResponseDto } from "../response/SuccessResponseDto.js";
import { ErrorHandler } from "../exception/ErrorHandler.js";

@Service()
@JsonController('/auth')
export class TokenController {
    constructor(private tokenService: TokenService, private errorHandler: ErrorHandler) {}

@HttpCode(200)
@Post('/refresh-token')
async refreshToken(@Req() req: Request, @Res() response: Response) {
    const refreshToken = req.headers.authorization?.split(' ')[1]; //Bearer token
    if(!refreshToken) {
        return response.status(401).send({message: "refreshToken이 필요합니다. "});
    }

    try {
        const newTokens = await this.tokenService.refreshToken(refreshToken);
        return response.send(SuccessResponseDto.of(newTokens));
    } catch (error) {
        return this.errorHandler.error(error, req, response, () => {});
    }
}

}