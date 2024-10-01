import { mockDeep, mockReset } from 'jest-mock-extended';
import { TrafficCollectionDetailRepository } from '../../../src/repository/TrafficCollectionDetail.Repository';
import { Repository, SelectQueryBuilder, DeleteQueryBuilder } from 'typeorm';
import { TrafficCollectionDetail } from '../../../src/entity/TrafficCollectionDetail';
import { TrafficCollection } from '../../../src/entity/TrafficCollection';
import { TransportationDetailDto } from '../../../src/dto/request/TransportationDetailDto';

const trafficCollectionDetail = {} as TrafficCollectionDetail;
const trafficCollectionDetails = [{}] as TrafficCollectionDetail[];
const trafficCollection = { id: 1 } as TrafficCollection;

const mockSelectQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue(undefined),
    getOne: jest.fn().mockResolvedValue(trafficCollectionDetail),
    getMany: jest.fn().mockResolvedValue(trafficCollectionDetails),
} as unknown as SelectQueryBuilder<TrafficCollectionDetail>;

const mockDeleteQueryBuilder = {
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ affected: 1 }),
} as unknown as DeleteQueryBuilder<TrafficCollectionDetail>;

describe('TrafficCollectionDetailRepository', () => {
    let trafficCollectionDetailRepository: TrafficCollectionDetailRepository;
    const mockTrafficCollectionDetailRepository = mockDeep<Repository<TrafficCollectionDetail>>();

    beforeEach(() => {
        mockReset(mockTrafficCollectionDetailRepository);
        trafficCollectionDetailRepository = new TrafficCollectionDetailRepository();
        trafficCollectionDetailRepository['save'] = mockTrafficCollectionDetailRepository.save;
        trafficCollectionDetailRepository['createQueryBuilder'] = mockTrafficCollectionDetailRepository.createQueryBuilder;
    });

    describe('insertTrafficCollectionDetail function test', () => {
        it('basic', async () => {
            const detailDto = new TransportationDetailDto();
            mockTrafficCollectionDetailRepository.save.mockResolvedValue(trafficCollectionDetail);
            const result = await trafficCollectionDetailRepository.insertTrafficCollectionDetail(detailDto, trafficCollection);
            expect(result).toEqual(trafficCollectionDetail);
            expect(mockTrafficCollectionDetailRepository.save).toHaveBeenCalled();

        });
    });

    describe('deleteTrafficCollectionDetailsByCollectionId function test', () => {
        it('basic', async () => {
            const trafficCollectionId = 1;
            mockTrafficCollectionDetailRepository.createQueryBuilder.mockReturnValueOnce(mockDeleteQueryBuilder as unknown as SelectQueryBuilder<TrafficCollectionDetail>);
            await trafficCollectionDetailRepository.deleteTrafficCollectionDetailsByCollectionId(trafficCollectionId);
            expect(mockDeleteQueryBuilder.delete).toHaveBeenCalled();
            expect(mockDeleteQueryBuilder.from).toHaveBeenCalledWith(TrafficCollectionDetail);
            expect(mockDeleteQueryBuilder.where).toHaveBeenCalledWith('trafficCollection = :trafficCollectionId', { trafficCollectionId });
            expect(mockDeleteQueryBuilder.execute).toHaveBeenCalled();
        });
    });
});
