import { mockDeep, mockReset } from 'jest-mock-extended';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Transportation } from '../../../src/entity/Transportation';
import { TransportationRepository } from '../../../src/repository/Transportation.Repository';
import { StationDto } from '../../../src/dto/request/StationDto';
import { TrafficCollectionDetail } from '../../../src/entity/TrafficCollectionDetail';

const transportation = {} as Transportation;

const mockSelectQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(transportation),
    getMany: jest.fn().mockResolvedValue([transportation]),
    execute: jest.fn().mockResolvedValue(undefined),
} as unknown as SelectQueryBuilder<Transportation>;

describe('TransportationRepository', () => {
    let transportationRepository: TransportationRepository;
    const mockTransportationRepository = mockDeep<Repository<Transportation>>();

    beforeEach(() => {
        mockReset(mockTransportationRepository);
        transportationRepository = new TransportationRepository();
        transportationRepository['save'] = mockTransportationRepository.save;
        transportationRepository['createQueryBuilder'] = mockTransportationRepository.createQueryBuilder;
    });

    describe('insertTansportation function test', () => {
        it('basic', async () => {
            const stationDto = new StationDto();
            const trafficCollectionDetail = {} as TrafficCollectionDetail;

            mockTransportationRepository.save.mockResolvedValue(transportation);
            const result = await transportationRepository.insertTransportation(stationDto, trafficCollectionDetail);

            expect(result).toEqual(transportation);
            expect(mockTransportationRepository.save).toHaveBeenCalled();
        });
    });
});
