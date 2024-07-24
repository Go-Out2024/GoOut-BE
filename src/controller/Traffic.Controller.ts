import { Body, Delete, Get, HttpCode, JsonController, Param, Patch, Post, QueryParam, QueryParams, Req, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import { SuccessResponseDto } from "../response/SuccessResponseDto.js";
import { compareAuthToken } from "../middleware/jwtMiddleware.js";
import { Request } from 'express'
import { TrafficService } from "../service/Traffic.Service.js";
import { CollectionInsert } from "../dto/request/CollectionInsert.js";
import { CollectionErase } from "../dto/request/CollectionErase.js";
import { CollectionUpdate } from "../dto/request/CollectionUpdate.js";
import { CollectionBring } from "../dto/request/CollectionBring.js";

@Service()
@JsonController('/traffic')
export class TrafficController{

    constructor(
        private readonly trafficService: TrafficService
    ){}

    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Post('/collection')
    async penetrateTrafficCollection(@Body() collectionInsert: CollectionInsert, @Req() req: Request) {
        await this.trafficService.penetrateTrafficCollection(collectionInsert, req.decoded.id);
        return SuccessResponseDto.of();
    }

    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Delete('/collection')
    async eraseTrafficCollection(@Body() collectionErase: CollectionErase, @Req() req: Request) {
        await this.trafficService.eraseTrafficCollection(req.decoded.id, collectionErase.getCollectionId());
        console.log("교통 컬렉션 삭제 완료");
        return SuccessResponseDto.of();
    }

    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Patch('/collection')
    async modifyTrafficCollection(@Body() collectionUpdate: CollectionUpdate, @Req() req: Request) {
        await this.trafficService.modifyTrafficCollection(collectionUpdate, req.decoded.id);
        console.log("교통 컬렉션 수정");
        return SuccessResponseDto.of();
    }

    @Get('/collection')
    @UseBefore(compareAuthToken)
    async bringTrafficCollections(@Req() req: Request) {
        const collections = await this.trafficService.bringTrafficCollectionsByUserId(req.decoded.id);
        return SuccessResponseDto.of(collections);
    }

    @Get('/collection/detail')
    @UseBefore(compareAuthToken)
    async getTrafficCollectionDetails(@Body() collectionBring: CollectionBring) {
        const collectionDetails = await this.trafficService.bringTrafficCollectionDetailsById(collectionBring.getCollectionId());
        return SuccessResponseDto.of(collectionDetails);
    }
}