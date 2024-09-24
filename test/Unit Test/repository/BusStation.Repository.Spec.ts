
import { BusStationRepository } from '../../../src/repository/BusStation.Repository';
import { BusStation } from '../../../src/entity/BusStation';
import { mockDeep, mockReset} from 'jest-mock-extended';
import { Repository, SelectQueryBuilder, UpdateQueryBuilder } from 'typeorm';


const mockSelectQueryBuilder = {
    innerJoinAndSelect:jest.fn().mockReturnThis(),
    innerJoin:jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    groupBy:jest.fn().mockReturnThis(),
    orderBy:jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue({} as BusStation),
    getMany: jest.fn().mockResolvedValue({} as BusStation[]),
    getRawMany: jest.fn().mockResolvedValue({})
} as unknown as SelectQueryBuilder<BusStation>;

const mockUpdateQueryBuilder = {
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    setParameters: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ affected: 1 })
} as unknown as UpdateQueryBuilder<BusStation>;


describe('BusStation Repository Test', ()=>{

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    let busStationRepository:BusStationRepository;
    const mockBusStationRepository = mockDeep<Repository<BusStation>>()

    beforeEach(async () => {
        mockReset(mockBusStationRepository);
        busStationRepository = new BusStationRepository();
        busStationRepository['findOne'] = mockBusStationRepository.findOne;
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });
    
    describe('findCoordinatesByBusStationName function test', ()=>{
        it('basic', async ()=>{
            const stationName = 'mock-stationName';
            const expectedBusStation = { id: 1, name: stationName, coordinates: { lat: 1.23, lng: 4.56 } } as unknown as BusStation;
            mockBusStationRepository.findOne.mockResolvedValue(expectedBusStation);
            const result = await busStationRepository.findCoordinatesByBusStationName(stationName);
            expect(result).toEqual(expectedBusStation);
            expect(mockBusStationRepository.findOne).toHaveBeenCalledWith({ where: { stationName } });
        });
    });
});


