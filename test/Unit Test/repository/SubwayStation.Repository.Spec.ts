import { SubwayStationRepository } from '../../../src/repository/SubwayStation.Repository';
import { SubwayStation } from '../../../src/entity/SubwayStation';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { Repository, SelectQueryBuilder } from 'typeorm';

const mockSubwayStations = [{} as unknown as SubwayStation] as unknown as SubwayStation[];
const mockSubwayStation = { subwayName: 'Central Station' } as unknown as SubwayStation;

const mockSelectQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(mockSubwayStations),
    getOne: jest.fn().mockResolvedValue(mockSubwayStation),
} as unknown as SelectQueryBuilder<SubwayStation>;

describe('SubwayStationRepository', () => {
    let subwayStationRepository: SubwayStationRepository;
    const mockSubwayStationRepository = mockDeep<Repository<SubwayStation>>();

    beforeEach(() => {
        mockReset(mockSubwayStationRepository);
        subwayStationRepository = new SubwayStationRepository();
        subwayStationRepository['save'] = mockSubwayStationRepository.save;
        subwayStationRepository['findOne'] = mockSubwayStationRepository.findOne;
        subwayStationRepository['createQueryBuilder'] = mockSubwayStationRepository.createQueryBuilder;
    });

    describe('findCoordinatesBySubwayStationName function test', () => {
        it('basic', async () => {
            const subwayName = 'Central Station';
            mockSubwayStationRepository.findOne.mockResolvedValueOnce(mockSubwayStation);
            const result = await subwayStationRepository.findCoordinatesBySubwayStationName(subwayName);
            expect(result).toEqual(mockSubwayStation);
            expect(subwayStationRepository['findOne']).toHaveBeenCalledWith({ where: { subwayName } });
        });
    });

    describe('findByStationName function test', () => {
        it('basic', async () => {
            const stationName = 'Central Station';
            mockSubwayStationRepository.findOne.mockResolvedValueOnce(mockSubwayStation);
            const result = await subwayStationRepository.findByStationName(stationName);
            expect(result).toEqual(mockSubwayStation);
            expect(subwayStationRepository['findOne']).toHaveBeenCalledWith({ where: { subwayName: stationName } });
        });
    });

    describe('findSubwayStations function test', () => {
        it('basic', async () => {
            const searchTerm = 'Cent';
            mockSubwayStationRepository.createQueryBuilder.mockReturnValueOnce(mockSelectQueryBuilder);
            const result = await subwayStationRepository.findSubwayStations(searchTerm);
            expect(result).toEqual(mockSubwayStations);
            expect(subwayStationRepository['createQueryBuilder']).toHaveBeenCalledWith('subwayStation');
            expect(mockSelectQueryBuilder.where).toHaveBeenCalledWith('subwayStation.subwayName LIKE :searchTerm', { searchTerm: `${searchTerm}%` });
            expect(mockSelectQueryBuilder.getMany).toHaveBeenCalled();
        });
    });
});
