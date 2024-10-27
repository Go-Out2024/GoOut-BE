import {
  JsonController,
  Post,
  Body,
  Res,
  HttpCode,
  Req,
  Delete,
} from "routing-controllers";
import { Request, Response, response } from "express";
import { Service } from "typedi";
import { AuthService } from "../service/Auth.Service";
import { SuccessResponseDto } from "../response/SuccessResponseDto";
import { ErrorHandler } from "../exception/ErrorHandler";
import { LogoutDto } from "../dto/request/LogoutDto";

@Service()
@JsonController("/auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private errorHandler: ErrorHandler
  ) {}

  @HttpCode(200)
  @Post("/login")
  async login(@Req() req: Request) {
    const accessToken = req.headers.authorization;
    const tokens = await this.authService.loginWithKakao(accessToken);
    return SuccessResponseDto.of(tokens);
  }

  @HttpCode(200)
  @Post("/login/apple")
  async appleLogin(@Req() req: Request) {
    const code = req.headers.authorization;
    const tokens = await this.authService.appleLogin(code);
    console.log("애플 로그인 완료");
    return SuccessResponseDto.of(tokens);
  }

  @HttpCode(200)
  @Delete("/logout")
  async logout(@Body() body: LogoutDto) {
    await this.authService.logout(body.refreshToken, body.firebaseToken);
    return SuccessResponseDto.of();
  }
}
