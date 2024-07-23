import { EntityRepository, Repository } from 'typeorm';
import { GridCoordinates } from '../entity/GridCoordinates';

@EntityRepository(GridCoordinates)
export class GridCoordinatesRepository extends Repository<GridCoordinates> {
    async findGridCoordinatesByLongitudeAndLatitude(longitude: number, latitude: number) {

        const tolerance = 0.01

        return this.createQueryBuilder("grid")
            .where("ABS(grid.longitude - :longitude) < :tolerance", { longitude, tolerance })
            .andWhere("ABS(grid.latitude - :latitude) < :tolerance", { latitude, tolerance })
            .getOne();
    }
}
