
import { GridCoordinatesRepository } from '../../../src/repository/GridCoordinates.Repository';
import { mockDeep, mockReset} from 'jest-mock-extended';
import { Repository,SelectQueryBuilder } from 'typeorm';
import { GridCoordinates } from '../../../src/entity/GridCoordinates';

const gridCoordinates = {} as GridCoordinates;

const mockSelectQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(gridCoordinates),
} as unknown as SelectQueryBuilder<GridCoordinates>;


describe('GridCoordinates Repository', () => {
    let gridCoordinatesRepository : GridCoordinatesRepository;
    const mockGridCoordinatesRepository = mockDeep<Repository<GridCoordinates>>();

    beforeEach(() => {
        mockReset(mockGridCoordinatesRepository);
        gridCoordinatesRepository = new GridCoordinatesRepository();
        gridCoordinatesRepository['createQueryBuilder'] = mockGridCoordinatesRepository.createQueryBuilder;
    });

    describe('findGridCoordinatesByLongitudeAndLatitud function test', () => {
        const tolerance = 0.01;
        const longitude= 1;
        const latitude =2;
        it('basic', async () => {
            mockGridCoordinatesRepository.createQueryBuilder.mockReturnValueOnce(mockSelectQueryBuilder);
            const result = await gridCoordinatesRepository.findGridCoordinatesByLongitudeAndLatitude(longitude, latitude);
            expect(result).toEqual(gridCoordinates);
            expect(gridCoordinatesRepository['createQueryBuilder']).toHaveBeenCalledWith("grid")
            expect(mockSelectQueryBuilder.where).toHaveBeenCalledWith("ABS(grid.longitude - :longitude) < :tolerance", { longitude, tolerance })
            expect(mockSelectQueryBuilder.andWhere).toHaveBeenCalledWith("ABS(grid.latitude - :latitude) < :tolerance", { latitude, tolerance })
            expect(mockSelectQueryBuilder.getOne).toHaveBeenCalled();
        });
    });


});