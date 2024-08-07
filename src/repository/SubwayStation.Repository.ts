import { EntityRepository, Repository } from 'typeorm';
import { SubwayStation } from '../entity/SubwayStation.js';

@EntityRepository(SubwayStation)
export class SubwayStationRepository extends Repository<SubwayStation> {

    /**
     * 역 이름에 해당하는 경도 위도 좌표 조회 함수
     * @param subwayName 역 이름
     * @returns 
     */
    async findCoordinatesBySubwayStationName(subwayName: string) {
        return this.findOne({ where: { subwayName }});
    }
}

