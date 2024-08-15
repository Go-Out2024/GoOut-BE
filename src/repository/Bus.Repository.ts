import { Entity, EntityRepository, Repository } from 'typeorm';
import { Bus } from '../entity/Bus.js';

@EntityRepository(Bus)
export class BusRepository extends Repository<Bus> {
    /**
     * 앞서 조회한 정류장 아이디를 이용해 해당 정류장을 지나는 버스 ID들, 버스 이름들, 버스 순번들 조회
     * @param stationId 정류장 아이디
     * @returns 
     */
    async findByStationId(stationId: number): Promise<{ bus_bus_id: number, bus_bus_name: string, bus_sequence: number}[]> {
        return this.createQueryBuilder('bus')
            .select([
                'bus.busId AS bus_bus_id',
                'bus.busName AS bus_bus_name',
                'bus.sequence AS bus_sequence'
            ])
            .where('bus.busStationId = :stationId', { stationId })
            .orderBy('bus.sequence', 'ASC')
            .getRawMany();
    }
}