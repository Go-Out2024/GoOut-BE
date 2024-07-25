import { EntityRepository, Repository } from 'typeorm';
import { BusStation } from '../entity/BusStation.js';

@EntityRepository(BusStation)
export class BusStationRepository extends Repository<BusStation> {

    /**
     * 역 이름에 해당하는 경도 위도 좌표 조회 함수
     * @param stationName 역 이름
     * @returns 
     */
    async findCoordinatesByBusStationName(stationName: string) {
        return this.findOne({ where: { stationName }});
    }
}

