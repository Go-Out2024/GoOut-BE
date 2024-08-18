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

    /**
     * 입력 단어 단위로 연관 정류장들 조회
     * @param searchTerm 입력 단어
     * @returns 
     */
    async findBusStations(searchTerm: string): Promise<BusStation[]> {
        return await this.createQueryBuilder('busStation')
            .where('busStation.stationName LIKE :searchTerm', { searchTerm: `${searchTerm}%` })
            .getMany();
    }
    
    /**
     * 버스 정류장 아이디로 버스 정류장 고유번호 조회
     * @param busStationId 버스 정류장 아이디
     * @returns 
     */
    async findStationNumByStationId(busStationId: number): Promise<number | null> {
        const busStation = await this.createQueryBuilder('busStation')
            .select('busStation.stationNum')
            .where('busStation.id = :busStationId', { busStationId })
            .getOne();
        
        return busStation.stationNum;
    }
}

