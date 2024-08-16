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
    
    /**
     * 역 이름으로 버스 정류장 조회
     * @param stationName 역 이름
     * @returns 
     */
    async findByStationName(stationName: string): Promise<BusStation[]> {
        return this.createQueryBuilder('bus_station')
            .where('bus_station.station_name = :stationName', { stationName })
            .getMany();
    }

    async findBusStations(searchTerm: string): Promise<BusStation[]> {
        return await this.createQueryBuilder('busStation')
            .where('busStation.stationName LIKE :searchTerm', { searchTerm: `${searchTerm}%` })
            .getMany();
    }
}

