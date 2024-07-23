import { EntityRepository, Repository } from 'typeorm';
import { SubwayStation } from '../entity/SubwayStation';

@EntityRepository(SubwayStation)
export class SubwayStationRepository extends Repository<SubwayStation> {
    async findCoordinatesBySubwayStationName(subwayName: string) {
        return this.findOne({ where: { subwayName }});
    }
}

