import { TrafficSearchService } from '../../../src/service/TrafficSearch.Service';
import { SubwayStationRepository } from '../../../src/repository/SubwayStation.Repository';
import { BusStationRepository } from '../../../src/repository/BusStation.Repository';
import { SubwayApi } from '../../../src/util/publicData';
import { BusApi } from '../../../src/util/publicData';
import { SubwayStationResult, BusStationResult, StationResult } from '../../../src/dto/values/StationResult';
import { SubwayArrivalInfo } from '../../../src/dto/values/SubwayArrivalInfo';
import { BusStationInfo, BusArrivalInfo, Station } from '../../../src/dto/values/BusArrivalInfo';
import { BusStation } from '../../../src/entity/BusStation';
import { ErrorResponseDto } from '../../../src/response/ErrorResponseDto';
import { ErrorCode } from '../../../src/exception/ErrorCode';
import { SubwayStation } from '../../../src/entity/SubwayStation';
import { AnyPtrRecord } from 'dns';

jest.mock('../../../src/repository/SubwayStation.Repository');
jest.mock('../../../src/repository/BusStation.Repository');
jest.mock('../../../src/util/publicData');
jest.mock('../../../src/dto/values/StationResult');
jest.mock('../../../src/dto/values/SubwayArrivalInfo');
jest.mock('../../../src/dto/values/BusArrivalInfo');

describe('TrafficSearchService', () => {

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    let trafficSearchService: TrafficSearchService;
    const subwayStationRepository = new SubwayStationRepository() as jest.Mocked<SubwayStationRepository>;
    const busStationRepository = new BusStationRepository() as jest.Mocked<BusStationRepository>;
    const subwayApi = new SubwayApi() as jest.Mocked<SubwayApi>;
    const busApi = new BusApi() as jest.Mocked<BusApi>;

    beforeEach(() => {
        trafficSearchService = new TrafficSearchService(subwayStationRepository, busStationRepository, subwayApi, busApi);
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });

    describe('bringStationInformation function test', () => {
        it('should handle subway station or busstation and return real-time information', async () => {
            const stationName = '강남역';
            const mockStationResult = {} as StationResult
            jest.spyOn(trafficSearchService as any, 'checkStationName').mockReturnValue(true);
            const handleSubwayOrBusStationSpy = jest.spyOn(trafficSearchService as any, 'handleSubwayOrBusStation').mockResolvedValue(mockStationResult);
            const result = await trafficSearchService.bringStationInformation(stationName);
            expect(handleSubwayOrBusStationSpy).toHaveBeenCalledWith(stationName);
            expect(result).toBe(mockStationResult);
        });

        it('should handle bus station and return real-time information', async () => {
            const stationName = '버스정류장';
            const mockStationResult = {} as StationResult
            jest.spyOn(trafficSearchService as any, 'checkStationName').mockReturnValue(false);
            const handleBusStationSpy = jest.spyOn(trafficSearchService as any, 'handleBusStation').mockResolvedValue(mockStationResult);
            const result = await trafficSearchService.bringStationInformation(stationName);
            expect(handleBusStationSpy).toHaveBeenCalledWith(stationName);
            expect(result).toBe(mockStationResult);
        });
    });

    describe('checkStationName function test', () => {
        it('should return true if stationName ends with "역"', () => {
            const result = trafficSearchService['checkStationName']('강남역');
            expect(result).toBe(true);
        });

        it('should return false if stationName does not end with "역"', () => {
            const result = trafficSearchService['checkStationName']('버스정류장');
            expect(result).toBe(false);
        });
    });


    describe('bringBusStationsInfo fucntion test', () => {
        it('should return mapped bus station info', async () => {
            const mockBusStations = [{
                getStationNum: jest.fn().mockReturnValue(1), getId: jest.fn().mockReturnValue(1),
                getStationName: jest.fn().mockReturnValue('강남역'), getXValue: jest.fn().mockReturnValue(50), getYValue: jest.fn().mockReturnValue(70),
            }] as unknown as BusStation[] 
            const mockBusArrivalInfo = [] as BusArrivalInfo[];
            jest.spyOn(trafficSearchService, 'bringBusArrivalInfo').mockResolvedValue(mockBusArrivalInfo);
            const ofSpy = jest.spyOn(BusStationInfo, 'of').mockReturnValue('busStationInfo' as unknown as BusStationInfo);
            const result = await trafficSearchService['bringBusStationsInfo'](mockBusStations);
            expect(ofSpy).toHaveBeenCalled();
            expect(result).toHaveLength(1);
        });
    });
    
    describe('handleSubwayOrBusStation function test', () => {
        it('should return SubwayStationResult when subway station exists and has arrival info', async () => {
            // Arrange
            const stationName = '강남역';
            const subwayName = '강남';
            const subwayStation = { getStationName: jest.fn().mockReturnValue('강남') } as unknown as SubwayStation;
            const subwayArrivalInfo = [] as SubwayArrivalInfo[];
            const subwayStationResult = SubwayStationResult.of(subwayArrivalInfo);
            jest.spyOn(subwayStationRepository, 'findByStationName').mockResolvedValue(subwayStation);
            jest.spyOn(busStationRepository, 'findByStationName').mockResolvedValue([]);
            jest.spyOn(trafficSearchService, 'bringSubwayArrivalInfo').mockResolvedValue(subwayArrivalInfo);
            jest.spyOn(StationResult, 'of').mockReturnValue(StationResult.of(subwayStationResult, undefined, undefined));
            const result = await trafficSearchService['handleSubwayOrBusStation'](stationName);
            expect(subwayStationRepository.findByStationName).toHaveBeenCalledWith(subwayName);
            expect(trafficSearchService.bringSubwayArrivalInfo).toHaveBeenCalledWith(subwayName);
            expect(StationResult.of).toHaveBeenCalledWith(subwayStationResult, undefined, undefined);
            expect(result).toEqual(StationResult.of(subwayStationResult, undefined, undefined));
        });

        it('should return SubwayStationResult with error message when subway station exists but no arrival info', async () => {
            const stationName = '강남역'
            const subwayName = '강남';
            const subwayStation = { getStationName: jest.fn().mockReturnValue('강남') } as unknown as SubwayStation;
            const errorResponse = ErrorResponseDto.of<SubwayArrivalInfo>(ErrorCode.NOT_FOUND_SUBWAY_ARRIVAL_INFO);
            const subwayErrorMessage = 'No arrival info';
            jest.spyOn(subwayStationRepository, 'findByStationName').mockResolvedValue(subwayStation);
            jest.spyOn(busStationRepository, 'findByStationName').mockResolvedValue([]);
            jest.spyOn(trafficSearchService, 'bringSubwayArrivalInfo').mockRejectedValue(errorResponse);
            jest.spyOn(StationResult, 'of').mockReturnValue(StationResult.of(undefined, undefined, subwayErrorMessage));
            const result = await trafficSearchService['handleSubwayOrBusStation'](stationName);
            expect(subwayStationRepository.findByStationName).toHaveBeenCalledWith(subwayName);
            expect(trafficSearchService.bringSubwayArrivalInfo).toHaveBeenCalledWith(subwayName);
            expect(StationResult.of).toHaveBeenCalledWith(undefined, undefined, subwayErrorMessage);
            expect(result).toEqual(StationResult.of(undefined, undefined, subwayErrorMessage));
        });

        it('should return BusStationResult when bus stations exist', async () => {
            const stationName = '강남역'
            const busStations = [{
                getStationNum: jest.fn().mockReturnValue(1), getId: jest.fn().mockReturnValue(1),
                getStationName: jest.fn().mockReturnValue('강남역'), getXValue: jest.fn().mockReturnValue(50), getYValue: jest.fn().mockReturnValue(70),
            }] as unknown as BusStation[] ;
            const busStationsInfo = [] as BusStationInfo[];
            const busStationResult = BusStationResult.of(busStationsInfo);
    
            jest.spyOn(subwayStationRepository, 'findByStationName').mockResolvedValue(undefined); // 지하철역 없음
            jest.spyOn(busStationRepository, 'findByStationName').mockResolvedValue(busStations);
            jest.spyOn(trafficSearchService as any, 'bringBusStationsInfo').mockResolvedValue(busStationsInfo);
            jest.spyOn(StationResult, 'of').mockReturnValue(StationResult.of(undefined, busStationResult, undefined));
            const result = await trafficSearchService['handleSubwayOrBusStation'](stationName);
            expect(subwayStationRepository.findByStationName).toHaveBeenCalledWith('강남');
            expect(busStationRepository.findByStationName).toHaveBeenCalledWith(stationName);
            expect((trafficSearchService as any).bringBusStationsInfo).toHaveBeenCalledWith(busStations);
            expect(StationResult.of).toHaveBeenCalledWith(undefined, busStationResult, undefined);
            expect(result).toEqual(StationResult.of(undefined, busStationResult, undefined));
        });
     
    });

    describe('handleBusStation function test', () => {

        it('basic', async () => {
        const stationName = '강남역';
        const busStations = [{
            getStationNum: jest.fn().mockReturnValue(1), getId: jest.fn().mockReturnValue(1),
            getStationName: jest.fn().mockReturnValue('강남역'), getXValue: jest.fn().mockReturnValue(50), getYValue: jest.fn().mockReturnValue(70),
        }] as unknown as BusStation[] ;
        const busStationsInfo = [] as BusStationInfo[];
        const busStationResult = BusStationResult.of(busStationsInfo);
        jest.spyOn(busStationRepository, 'findByStationName').mockResolvedValue(busStations);
        jest.spyOn(trafficSearchService as any, 'bringBusStationsInfo').mockResolvedValue(busStationsInfo);

        // BusStationResult.of 모킹
        jest.spyOn(BusStationResult, 'of').mockReturnValue(busStationResult);

        const result = await trafficSearchService['handleBusStation'](stationName);

        // 호출 여부 및 반환 값 테스트
        expect(busStationRepository.findByStationName).toHaveBeenCalledWith(stationName);
        expect((trafficSearchService as any).bringBusStationsInfo).toHaveBeenCalledWith(busStations);
        expect(BusStationResult.of).toHaveBeenCalledWith(busStationsInfo);
        expect(result).toEqual(StationResult.of(undefined, busStationResult, undefined));
        });
    });

    describe('bringBusStationsInfo fucntion test', () => {
        it('should return mapped bus station info', async () => {
            const mockBusStations = [{
                getStationNum: jest.fn().mockReturnValue(1), getId: jest.fn().mockReturnValue(1),
                getStationName: jest.fn().mockReturnValue('강남역'), getXValue: jest.fn().mockReturnValue(50), getYValue: jest.fn().mockReturnValue(70),
            }] as unknown as BusStation[] 
            const mockBusArrivalInfo = [] as BusArrivalInfo[];
            jest.spyOn(trafficSearchService, 'bringBusArrivalInfo').mockResolvedValue(mockBusArrivalInfo);
            const ofSpy = jest.spyOn(BusStationInfo, 'of').mockReturnValue('busStationInfo' as unknown as BusStationInfo);
            const result = await trafficSearchService['bringBusStationsInfo'](mockBusStations);
            expect(ofSpy).toHaveBeenCalled();
            expect(result).toHaveLength(1);
        });
    });

    describe('removeStationSuffix function test', () => {
        it('basic', () => {
            const result = trafficSearchService['removeStationSuffix']('강남역');
            expect(result).toBe('강남');
        });
    });

    describe('bringSubwayStationInfo function test', () => {
        it('basic', async () => {
            const subwayName = '역삼';
            const arrivalList = [{ statnNm: subwayName, subwayId: '1001', trainLineNm: 'Station - C', arvlMsg2: 'string', arvlMsg3: 'string', bstatnNm: 'string', barvlDt: 5 }];
            trafficSearchService.bringSubwayArrivalInfo = jest.fn().mockResolvedValue(arrivalList);
            const result = await trafficSearchService.bringSubwayStationInfo(subwayName);
            expect(result.length).toBe(1);
            expect(trafficSearchService.bringSubwayArrivalInfo).toHaveBeenCalledWith(subwayName);
        });
    });

    describe('bringBusStationInfo function test', () => {
        it('basic', async () => {
            const stationName = '서울역';
            const busStationId = 101;
            const stationNum = 123;
            const busArrivalInfo = [] as BusArrivalInfo[];
            const stationDto = { id: busStationId, stationName } as unknown as Station;
            busStationRepository.findStationNumByStationId = jest.fn().mockResolvedValue(stationNum);
            trafficSearchService.bringBusArrivalInfo = jest.fn().mockResolvedValue(busArrivalInfo);
            BusStationInfo.of = jest.fn().mockReturnValue({ stationDto, busArrivalInfo });
    
            const result = await trafficSearchService.bringBusStationInfo(stationName, busStationId);
    
            expect(result).toEqual({ stationDto, busArrivalInfo });
            expect(busStationRepository.findStationNumByStationId).toHaveBeenCalledWith(busStationId);
            expect(trafficSearchService.bringBusArrivalInfo).toHaveBeenCalledWith(stationNum);
        });
    });

    describe('bringStationRelatedSearch function test', () => {
    it('basic', async () => {
        const searchTerm = '역삼';
        const subwayResults = [{ getSubwayName: () => '역삼' }];
        const busStationResults = [{ getStationName: () => '역삼역앞', getId: () => 101 }];
        subwayStationRepository.findSubwayStations = jest.fn().mockResolvedValue(subwayResults);
        busStationRepository.findBusStations = jest.fn().mockResolvedValue(busStationResults);
        const result = await trafficSearchService.bringStationRelatedSearch(searchTerm);
        expect(result).toEqual([
            { name: '역삼', type: '지하철' },
            { name: '역삼역앞', id: 101, type: '버스' }
        ]);
        expect(subwayStationRepository.findSubwayStations).toHaveBeenCalledWith(searchTerm);
        expect(busStationRepository.findBusStations).toHaveBeenCalledWith(searchTerm);
        });
    });

    describe('bringSubwayArrivalInfo function test', () => {
        it('basic', async () => {
            const stationName = '녹사평역';
            const arrivalList = [{statnNm: '녹사평역', subwayId: '1001', trainLineNm: 'Station - C', arvlMsg2: 'string', arvlMsg3: 'string', bstatnNm: 'string', barvlDt: 5}];
            subwayApi.bringSubwayArrivalInfo.mockResolvedValue(arrivalList);
            const result = await trafficSearchService.bringSubwayArrivalInfo(stationName);
            expect(result.length).toBe(1);
            expect(subwayApi.bringSubwayArrivalInfo).toHaveBeenLastCalledWith(stationName);
            
        });
    });

    describe('bringBusArrivalInfo fucntion test', () => {
        it('basic', async () => {
            const stationNum = 101;
            const busArrivalList = [{ busRouteAbrv: '100' }];
            busApi.bringBusArrivalInfo.mockResolvedValue(busArrivalList);
            const result = await trafficSearchService.bringBusArrivalInfo(stationNum);
            expect(result.length).toBe(1);
            expect(busApi.bringBusArrivalInfo).toHaveBeenLastCalledWith(stationNum);
        });
    });
});
