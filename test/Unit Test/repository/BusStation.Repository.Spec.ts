
import { BusStationRepository } from '../../../src/repository/BusStation.Repository';
import { BusStation } from '../../../src/entity/BusStation';
import { mockDeep, mockReset} from 'jest-mock-extended';
import { Repository, SelectQueryBuilder, UpdateQueryBuilder } from 'typeorm';

const mockBusStations = [{} as unknown as BusStation] as unknown as BusStation[];
const mockBusStation = {stationNum:100} as unknown as BusStation;

const mockSelectQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(mockBusStation),
    getMany: jest.fn().mockResolvedValue(mockBusStations),
} as unknown as SelectQueryBuilder<BusStation>;

describe('BusStationRepository', () => {
    let busStationRepository: BusStationRepository;
    const mockBusStationRepository = mockDeep<Repository<BusStation>>();

    beforeEach(() => {
        mockReset(mockBusStationRepository);
        busStationRepository = new BusStationRepository();
        busStationRepository['save'] = mockBusStationRepository.save;
        busStationRepository['findOne'] = mockBusStationRepository.findOne;
        busStationRepository['createQueryBuilder'] = mockBusStationRepository.createQueryBuilder;
    });

    describe('findCoordinatesByBusStationName function test', () => {
        it('basic', async () => {
            const stationName = 'Central Station';
            mockBusStationRepository.findOne.mockResolvedValueOnce(mockBusStation);
            const result = await busStationRepository.findCoordinatesByBusStationName(stationName);
            expect(result).toEqual(mockBusStation);
            expect(busStationRepository['findOne']).toHaveBeenCalledWith({ where: { stationName } });
        });
    });

    describe('findByStationName function test', () => {
        it('basic', async () => {
            const stationName = 'Central Station';
            mockBusStationRepository.createQueryBuilder.mockReturnValueOnce(mockSelectQueryBuilder);
            const result = await busStationRepository.findByStationName(stationName);
            expect(result).toEqual(mockBusStations);
            expect(busStationRepository['createQueryBuilder']).toHaveBeenCalledWith('bus_station');
            expect(mockSelectQueryBuilder.where).toHaveBeenCalledWith('bus_station.station_name = :stationName', { stationName });
            expect(mockSelectQueryBuilder.getMany).toHaveBeenCalled();
        });
    });

    describe('findBusStations function test', () => {
        it('basic', async () => {
            const searchTerm = 'Cent';
            mockBusStationRepository.createQueryBuilder.mockReturnValueOnce(mockSelectQueryBuilder);
            const result = await busStationRepository.findBusStations(searchTerm);
            expect(result).toEqual(mockBusStations);
            expect(busStationRepository['createQueryBuilder']).toHaveBeenCalledWith('busStation');
            expect(mockSelectQueryBuilder.where).toHaveBeenCalledWith('busStation.stationName LIKE :searchTerm', { searchTerm: `${searchTerm}%` });
            expect(mockSelectQueryBuilder.getMany).toHaveBeenCalled();
        });
    });

    describe('findStationNumByStationId function test', () => {
        it('basic', async () => {
            const busStationId = 1;
            const stationNum = 100;
            mockBusStationRepository.createQueryBuilder.mockReturnValueOnce(mockSelectQueryBuilder);
            const result = await busStationRepository.findStationNumByStationId(busStationId);
            expect(result).toEqual(stationNum);
            expect(busStationRepository['createQueryBuilder']).toHaveBeenCalledWith('busStation');
            expect(mockSelectQueryBuilder.select).toHaveBeenCalledWith('busStation.stationNum');
            expect(mockSelectQueryBuilder.where).toHaveBeenCalledWith('busStation.id = :busStationId', { busStationId });
            expect(mockSelectQueryBuilder.getOne).toHaveBeenCalled();
        });
    });
});