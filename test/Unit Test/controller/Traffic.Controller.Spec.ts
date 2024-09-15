import { TrafficController } from '../../../src/controller/Traffic.Controller'
import { TrafficService } from '../../../src/service/Traffic.Service';
import { TrafficSearchService } from '../../../src/service/TrafficSearch.Service';
import { CollectionInsert } from '../../../src/dto/request/CollectionInsert';
import { Request } from 'express';
import { SuccessResponseDto } from '../../../src/response/SuccessResponseDto';
import { CollectionErase } from '../../../src/dto/request/CollectionErase';
import { CollectionNameUpdate } from '../../../src/dto/request/CollectionNameUpdate';
import { CollectionDetailUpdate } from '../../../src/dto/request/CollectionDetailUpdate';
import { CollectionBring } from '../../../src/dto/request/CollectionBring';
import { CollectionChoice } from '../../../src/dto/request/CollectionChoice';
import { CollectionChange } from '../../../src/dto/request/CollectionChange';
import { TrafficCollection } from '../../../src/entity/TrafficCollection';
import { StationResult } from '../../../src/dto/values/StationResult';
import { SubwayArrivalInfo } from '../../../src/dto/values/SubwayArrivalInfo';
import { BusStationInfo } from '../../../src/dto/values/BusArrivalInfo';

declare module 'express-serve-static-core' {
    interface Request {
        decoded: {id: number};
    }
}

jest.mock('../../../src/service/Traffic.Service');
jest.mock('../../../src/service/TrafficSearch.Service');

describe('Traffic Controller Test', () => {

    beforeAll(async()=>{
    });

    afterAll(async()=>{
    });

    const trafficService = new TrafficService({} as any, {} as any, {} as any, {} as any, {} as any, {} as any, {} as any, {} as any) as jest.Mocked<TrafficService>;
    const trafficSearchService = new TrafficSearchService({} as any, {} as any, {} as any, {} as any) as jest.Mocked<TrafficSearchService>;
    const trafficController = new TrafficController(trafficService, trafficSearchService);
    const req = { decoded: { id:1 }} as Request;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('penerateTrafficCollection function test', () => {
        it('basic', async () => {
            const collectionInsert = new CollectionInsert();
            const result = await trafficController.penetrateTrafficCollection(collectionInsert, req);
            expect(result).toEqual(SuccessResponseDto.of());
            expect(trafficService.penetrateTrafficCollection).toHaveBeenCalledWith(collectionInsert, req.decoded.id);
    });
});

    describe('eraseTrafficCollection function test', () => {
        it('basic', async () => {
            const collectionErase = { getCollectionId: jest.fn().mockReturnValue(1)} as unknown as CollectionErase;
            const result = await trafficController.eraseTrafficCollection(collectionErase, req);
            expect(result).toEqual(SuccessResponseDto.of());
            expect(trafficService.eraseTrafficCollection).toHaveBeenCalledWith(req.decoded.id, collectionErase.getCollectionId());
        });
    });

    describe('modifyTrafficCollectionName function test', () => {
        it('basic', async () => {
            const collectionNameUpdate = {} as CollectionNameUpdate;
            const result = await trafficController.modifyTrafficCollectionName(collectionNameUpdate, req);
            expect(result).toEqual(SuccessResponseDto.of());
            expect(trafficService.modifyTrafficCollectionName).toHaveBeenCalledWith(collectionNameUpdate, req.decoded.id);
        });
    });

    describe('mdifyTrafficCollectionDetail function test', () => {
        it('basic', async () => {
            const collectionDetailUpdate = {} as CollectionDetailUpdate;
            const result = await trafficController.modifyTrafficCollectionDetail(collectionDetailUpdate, req);
            expect(result).toEqual(SuccessResponseDto.of());
            expect(trafficService.modifyTrafficCollectionDetail).toHaveBeenCalledWith(collectionDetailUpdate, req.decoded.id);
        });
    });

    describe('bringTrafficCollections function test', () => {
        it('basic', async () => {
            const currentTime = new Date();
            const collections: TrafficCollection[] = [];  
            trafficService.bringTrafficCollectionsByUserId.mockResolvedValue(collections);
            const result = await trafficController.bringTrafficCollections(req);
            expect(result).toEqual(SuccessResponseDto.of(collections));
            expect(trafficService.bringTrafficCollectionsByUserId).toHaveBeenCalledWith(req.decoded.id, currentTime);
        });
    });

    describe('bringTrafficCollectionDetails function test', () => {
        it('basic', async () => {
            const collectionBring = { getCollectionId: jest.fn().mockReturnValue(1) } as unknown as CollectionBring;
            const collectionDetails = {} as TrafficCollection;
            trafficService.bringTrafficCollectionDetailsById.mockResolvedValue(collectionDetails);
            const result = await trafficController.bringTrafficCollectionDetails(collectionBring, req);
            expect(result).toEqual(SuccessResponseDto.of(collectionDetails));
            expect(trafficService.bringTrafficCollectionDetailsById).toHaveBeenCalledWith(req.decoded.id, collectionBring.getCollectionId());
        });
    });

    describe('choiceTrafficCollection function test', () => {
        it('basic', async () => {
            const collectionChoice = { getCollectionId: jest.fn().mockReturnValue(1) } as unknown as CollectionChoice;
            const result = await trafficController.choiceTrafficCollection(collectionChoice, req);
            expect(result).toEqual(SuccessResponseDto.of());
            expect(trafficService.choiceTrafficCollection).toHaveBeenCalledWith(req.decoded.id, collectionChoice.getCollectionId());
        });
    });

    describe('bringMainTrafficCollection function test', () => {
        it('basic', async () => {
            const collection = {
                collection: {} as TrafficCollection,
                result: {} as StationResult
            };
            trafficService.bringMainTrafficCollection.mockResolvedValue(collection);
            const result = await trafficController.bringMainTrafficCollection(req);
            expect(result).toEqual(SuccessResponseDto.of(collection));
            expect(trafficService.bringMainTrafficCollection).toHaveBeenCalledWith(req.decoded.id);
        });
    });

    describe('changeTrafficRoute function test', () => {
        it('basic', async () => {
            const collectionChange = { getStatus: jest.fn().mockReturnValue(1) } as unknown as CollectionChange;
            const newCollection = {
                collection: {} as TrafficCollection,
                result: {} as StationResult
            }
            trafficService.changeTrafficRoute.mockResolvedValue(newCollection);
            const result = await trafficController.changeTrafficRoute(collectionChange, req);
            expect(result).toEqual(SuccessResponseDto.of(newCollection));
            expect(trafficService.changeTrafficRoute).toHaveBeenCalledWith(req.decoded.id, collectionChange.getStatus());
        });
    });

    describe('bringStationInformation function test', () => {
        it('basic', async () => {
            const stationName = 'station';
            const stationInfo = {} as StationResult;
            trafficSearchService.bringStationInformation.mockResolvedValue(stationInfo);
            const result = await trafficController.bringStationInformation(stationName);
            expect(result).toEqual(SuccessResponseDto.of(stationInfo));
            expect(trafficSearchService.bringStationInformation).toHaveBeenCalledWith(stationName);
        });
    });

    describe('bringStationRelatedSearch function test', () => {
        it('basic', async () => {
            const searchTerm = 'term';
            const relatedSearch = [] as any;
            trafficSearchService.bringStationRelatedSearch.mockResolvedValue(relatedSearch);
            const result = await trafficController.bringStationRelatedSearch(searchTerm);
            expect(result).toEqual(SuccessResponseDto.of(relatedSearch));
            expect(trafficSearchService.bringStationRelatedSearch).toHaveBeenCalledWith(searchTerm);
        });
    });

    describe('bringSubwayStationInfo function test', () => {
        it('basic', async () => {
            const subwayName = 'subwayName';
            const subwayInfo = [] as SubwayArrivalInfo[];
            trafficSearchService.bringSubwayStationInfo.mockResolvedValue(subwayInfo);
            const result = await trafficController.bringSubwayStationInfo(subwayName);
            expect(result).toEqual(SuccessResponseDto.of(subwayInfo));
            expect(trafficSearchService.bringSubwayStationInfo).toHaveBeenCalledWith(subwayName);
        });
    });

    describe('bringBusStationInfo function test', () => {
        it('basic', async () => {
            const stationName = 'stationName';
            const busStationId = 100000001;
            const busInfo = {} as BusStationInfo;
            trafficSearchService.bringBusStationInfo.mockResolvedValue(busInfo);
            const result = await trafficController.bringBusStationInfo(stationName, busStationId);
            expect(result).toEqual(SuccessResponseDto.of(busInfo));
            expect(trafficSearchService.bringBusStationInfo).toHaveBeenCalledWith(stationName, busStationId);
        });
    });

});