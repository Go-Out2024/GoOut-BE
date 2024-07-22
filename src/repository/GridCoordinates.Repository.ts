import { EntityRepository, Repository } from 'typeorm';
import { GridCoordinates } from '../entity/GridCoordinates';

@EntityRepository(GridCoordinates)
export class GridCoordinatesRepository extends Repository<GridCoordinates> {
    async findNearbyGridCoordinates(longitude: number, latitude: number, tolerance: number = 0.01) {
        console.log(`Searching for grid coordinates near Longitude: ${longitude}, Latitude: ${latitude}`);

        const gridData = await this.createQueryBuilder("grid")
            .where("ABS(grid.longitude - :longitude) < :tolerance", { longitude, tolerance })
            .andWhere("ABS(grid.latitude - :latitude) < :tolerance", { latitude, tolerance })
            .getOne();

        console.log(`Grid Data: ${gridData}`);
        return gridData;
    }
}
