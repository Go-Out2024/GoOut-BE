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
    
    /**
     * 지하철 역 이름으로 지하철 역 조회
     * @param stationName 지하철 역 이름
     * @returns 
     */
    async findByStationName(stationName: string): Promise<SubwayStation | undefined> {
        return this.findOne({ where: { subwayName: stationName }});
    }
}

