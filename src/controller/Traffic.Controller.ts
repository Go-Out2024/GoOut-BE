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

    /**
     * 교통 컬렉션 등록 함수
     * @param collectionInsert 교통 컬렉션 등록 dto
     * @param req 
     * @returns 
     */
    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Post('/collection')
    async penetrateTrafficCollection(@Body() collectionInsert: CollectionInsert, @Req() req: Request) {
        await this.trafficService.penetrateTrafficCollection(collectionInsert, req.decoded.id);
        console.log("교통 컬렉션 등록 완료")
        return SuccessResponseDto.of();
    }

    /**
     * 교통 컬렉션 삭제 함수
     * @param collectionErase 교통 컬렉션 삭제 dtd 
     * @param req 
     * @returns 
     */
    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Delete('/collection')
    async eraseTrafficCollection(@Body() collectionErase: CollectionErase, @Req() req: Request) {
        await this.trafficService.eraseTrafficCollection(req.decoded.id, collectionErase.getCollectionId());
        console.log("교통 컬렉션 삭제 완료");
        return SuccessResponseDto.of();
    }

    /**
     * 교통 컬렉션 수정 함수
     * @param collectionUpdate 교통 컬렉션 수정 dto
     * @param req 
     * @returns 
     */
    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Patch('/collection')
    async modifyTrafficCollection(@Body() collectionUpdate: CollectionUpdate, @Req() req: Request) {
        await this.trafficService.modifyTrafficCollection(collectionUpdate, req.decoded.id);
        console.log("교통 컬렉션 수정 완료");
        return SuccessResponseDto.of();
    }

    /**
     * 유저 아이디로 모든 교통 컬렉션 조회 
     * @param req 
     * @returns 
     */
    @Get('/collection')
    @UseBefore(compareAuthToken)
    async bringTrafficCollections(@Req() req: Request) {
        const currentTime = new Date()
        const collections = await this.trafficService.bringTrafficCollectionsByUserId(req.decoded.id, currentTime);
        return SuccessResponseDto.of(collections);
    }

    /**
     * 특정 교통 컬렉션 조회
     * @param collectionBring 교통 컬렉션 조회 dto
     * @param req 
     * @returns 
     */
    @Get('/collection/detail')
    @UseBefore(compareAuthToken)
    async bringTrafficCollectionDetails(@Body() collectionBring: CollectionBring, @Req() req: Request) {
        const collectionDetails = await this.trafficService.bringTrafficCollectionDetailsById(req.decoded.id, collectionBring.getCollectionId());
        return SuccessResponseDto.of(collectionDetails);
    }

}