import { EntityRepository, Repository } from 'typeorm';
import { GridCoordinates } from '../entity/GridCoordinates';

@EntityRepository(GridCoordinates)
export class GridCoordinatesRepository extends Repository<GridCoordinates> {

    /**
     * 경도 위도 좌표 값에 해당하는 격자 X, Y 값 조회 함수
     * @param longitude 경도
     * @param latitude 위도
     * @returns 
     */
    async findGridCoordinatesByLongitudeAndLatitude(longitude: number, latitude: number) {

        const tolerance = 0.01

        return this.createQueryBuilder("grid")
            .where("ABS(grid.longitude - :longitude) < :tolerance", { longitude, tolerance })
            .andWhere("ABS(grid.latitude - :latitude) < :tolerance", { latitude, tolerance })
            .getOne();
    }
}
