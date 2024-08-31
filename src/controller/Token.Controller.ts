import { JsonController, Post, Body, Res, Req, HttpCode } from "routing-controllers";
import { Response, Request } from "express";
import { Service } from "typedi";
import { TokenService } from "../service/Token.Service";
import { SuccessResponseDto } from "../response/SuccessResponseDto";
import { ErrorHandler } from "../exception/ErrorHandler";

@Service()
@JsonController('/auth')
export class TokenController {
    constructor(private tokenService: TokenService, private errorHandler: ErrorHandler) {}

@HttpCode(200)
@Post('/refresh-token')
async verifyRefreshToken(
    @Req() req: Request, 
    @Res() response: Response) {
    const refreshToken = req.headers.authorization?.split(' ')[1]; //Bearer token
    if(!refreshToken) {
        return response.status(401).send({message: "refreshToken이 필요합니다. "});
    }

    try {
        const newTokens = await this.tokenService.verifyRefreshToken(refreshToken);
        return response.send(SuccessResponseDto.of(newTokens));
    } catch (error) {
        return this.errorHandler.error(error, req, response, () => {});
    }
}

}