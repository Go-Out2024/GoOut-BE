import { JsonController, Post, Body, Res, HttpCode, Req, Delete, Get } from "routing-controllers";
import { Service } from "typedi";
import { SuccessResponseDto } from "../response/SuccessResponseDto.js";
import { FamousSayingService } from "../service/FamousSaying.Service.js";


@Service()
@JsonController('/famous-saying')
export class FamousSayingController {
    constructor(private readonly famousSayingService:FamousSayingService) {}

    @HttpCode(200)
    @Get()
    async bringFamousSaying() {
      const result = await this.famousSayingService.bringFamousSaying();
      console.log("명언 랜덤 조회 완료");
      return SuccessResponseDto.of(result);
    }

}