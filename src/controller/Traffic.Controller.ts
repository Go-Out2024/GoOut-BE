import { Body, Delete, Get, HttpCode, JsonController, Param, Patch, Post, QueryParam, QueryParams, Req, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import { SuccessResponseDto } from "../response/SuccessResponseDto";
import { compareAuthToken } from "../middleware/jwtMiddleware";
import { Request } from 'express'
import { TrafficService } from "../service/Traffic.Service";
import { CollectionInsert } from "../dto/request/CollectionInsert";
import { CollectionErase } from "../dto/request/CollectionErase";
import { CollectionBring } from "../dto/request/CollectionBring";
import { CollectionChoice } from "../dto/request/CollectionChoice";
import { CollectionChange } from "../dto/request/CollectionChange";
import { TrafficSearchService } from "../service/TrafficSearch.Service";
import { CollectionNameUpdate } from "../dto/request/CollectionNameUpdate";
import { CollectionDetailUpdate } from "../dto/request/CollectionDetailUpdate";

@Service()
@JsonController('/traffic')
export class TrafficController{

    constructor(
        private readonly trafficService: TrafficService,
        private readonly trafficSearchService: TrafficSearchService
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
     * 교통 컬렉션 이름 수정 함수
     * @param collectionUpdate 교통 컬렉션 수정 dto
     * @param req 
     * @returns 
     */
    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Patch('/collection/name')
    async modifyTrafficCollectionName(@Body() collectionNameUpdate: CollectionNameUpdate, @Req() req: Request) {
        await this.trafficService.modifyTrafficCollectionName(collectionNameUpdate, req.decoded.id);
        console.log("교통 컬렉션 이름 수정 완료");
        return SuccessResponseDto.of();
    }

    /**
     * 교통 컬렉션 상세정보 수정 함수
     * @param collectionUpdate 교통 컬렉션 수정 dto
     * @param req 
     * @returns 
     */
    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Patch('/collection/detail')
    async modifyTrafficCollectionDetail(@Body() collectionDetailUpdate: CollectionDetailUpdate, @Req() req: Request) {
        await this.trafficService.modifyTrafficCollectionDetail(collectionDetailUpdate, req.decoded.id);
        console.log("교통 컬렉션 상세 정보들 수정 완료");
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
        console.log("교통 컬렉션 조회 완료");
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
        console.log("특정 교통 컬렉션 조회 완료");
        return SuccessResponseDto.of(collectionDetails);
    }

    /**
     * 특정 교통 컬렉션 선택
     * @param collectionChoice 교통 컬렉션 선택 dto 
     * @param req 
     * @returns 
     */
    @Post('/collection/choice')
    @UseBefore(compareAuthToken)
    async choiceTrafficCollection(@Body() collectionChoice: CollectionChoice, @Req() req: Request) {
        await this.trafficService.choiceTrafficCollection(req.decoded.id, collectionChoice.getCollectionId());
        console.log("교통 컬렉션 체크박스 업데이트 완료");
        return SuccessResponseDto.of();
    }

    /**
     * 메인 화면 교통 컬렉션 조회 함수
     * @param req 
     * @returns 
     */
    @Get('/collection/main')
    @UseBefore(compareAuthToken)
    async bringMainTrafficCollection(@Req() req: Request) {
        const collection = await this.trafficService.bringMainTrafficCollection(req.decoded.id);
        console.log("메인 화면 교통 컬렉션 조회 완료");
        return SuccessResponseDto.of(collection);
    }

    /**
     * 루트 전환 함수
     * @param collectionChange 컬렉션 전환 dto
     * @param req 
     * @returns 
     */
    @Get('/collection/change')
    @UseBefore(compareAuthToken)
    async changeTrafficRoute(@Body() collectionChange:CollectionChange, @Req() req: Request) {
        const newCollection = await this.trafficService.changeTrafficRoute(req.decoded.id, collectionChange.getStatus());
        console.log("교통 컬렉션 루트 전환 완료");
        return SuccessResponseDto.of(newCollection);
    }

    /**
     * 역 또는 정류장 이름에 대한 도착시간 정보 조회
     * @param stationName 역 또는 정류장 이름
     * @returns 
     */
    @Get('/time-information')
    async bringStationInformation(@QueryParam('stationName') stationName: string) {
        const result = await this.trafficSearchService.bringStationInformation(stationName);
        console.log("해당 역 또는 정류장 정보 가져오기 성공");
        return SuccessResponseDto.of(result);
    }

    /**
     * 단어 단위로 입력 시 연관 검색어 조회 함수
     * @param searchTerm 입력 단어
     * @returns 
     */
    @Get('/related-search')
    async bringStationRelatedSearch(@QueryParam('searchTerm') searchTerm: string) {
        const result = await this.trafficSearchService.bringStationRelatedSearch(searchTerm);
        console.log("해당 단어에 대한 연관 검색어 조회 성공");
        return SuccessResponseDto.of(result);
    }

    /**
     * 연관 검색어를 이용해 사용자가 지하철 역 선택 시 지하철 역 이름으로 해당 역 정보 제공 함수
     * @param subwayName 지하철 역 이름
     * @returns 
     */
    @Get('/time-information/subway')
    async bringSubwayStationInfo(
        @QueryParam('subwayName') subwayName: string){
        const result = await this.trafficSearchService.bringSubwayStationInfo(subwayName);
        console.log('지하철 역 정보 가져오기 성공')
        return SuccessResponseDto.of(result);
    }

    /**
     * 연관 검색어를 이용해 사용자가 버스 정류장 선텍 시 버스 정류장 이름과 아이디로 해당 정류장 정보 제공 함수
     * @param stationName 정류장 이름
     * @param busStationId 버스 정류장 아이디
     * @returns 
     */
    @Get('/time-information/bus')
    async bringBusStationInfo(
        @QueryParam('stationName') stationName: string,
        @QueryParam('busStationId') busStationId: number){
        const result = await this.trafficSearchService.bringBusStationInfo(stationName, busStationId);
        console.log('버스 정류장 정보 가져오기 성공')
        return SuccessResponseDto.of(result);
    }
}