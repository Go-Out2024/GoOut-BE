import { mockDeep, mockReset } from 'jest-mock-extended';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TransportationNumberRepository } from '../../../src/repository/TransportationNumber.Repository';
import { Transportation } from '../../../src/entity/Transportation';
import { TransportationNumber } from '../../../src/entity/TransportationNumber';

const transportationNumber = {} as TransportationNumber;
const transportation = {} as Transportation;

const mockSelectQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([transportationNumber]),
    execute: jest.fn().mockResolvedValue(undefined),
} as unknown as SelectQueryBuilder<TransportationNumber>;

describe('TransportationNumberRepository', () => {
    let transportationNumberRepository: TransportationNumberRepository;
    const mockTransportationNumberRepository = mockDeep<Repository<TransportationNumber>>();

    beforeEach(() => {
        mockReset(mockTransportationNumberRepository);
        transportationNumberRepository = new TransportationNumberRepository();
        transportationNumberRepository['save'] = mockTransportationNumberRepository.save;
        transportationNumberRepository['createQueryBuilder'] = jest.fn(() => mockSelectQueryBuilder);
    });

    describe('insertTransportationNumbers function test', () => {
        it('basic', async () => {
            const numbers = ['100', '200'];
            const transportationNumbers = numbers.map(number => {
                return new TransportationNumber(number, transportation.id);
            });
            mockTransportationNumberRepository.save.mockResolvedValue(transportationNumbers as any);
            const result = await transportationNumberRepository.insertTransportationNumbers(numbers, transportation);
            expect(result).toEqual(transportationNumbers);
            expect(mockTransportationNumberRepository.save).toHaveBeenCalledWith(transportationNumbers);
        });
    });
    
    describe('findTransportationNumbers function test', () => {
        it('basic', async () => {
            const transportationId = 1;
            const result = await transportationNumberRepository.findTransportationNumbers(transportationId);
            expect(result).toEqual([transportationNumber]);
            expect(mockSelectQueryBuilder.where).toHaveBeenCalledWith(
                'transportationNumber.transportation_id = :transportationId', { transportationId });
            expect(mockSelectQueryBuilder.select).toHaveBeenCalledWith('transportationNumber.numbers');
        });
    });
});
