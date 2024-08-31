import { Entity, EntityRepository, Repository } from 'typeorm';
import { Bus } from '../entity/Bus';

@EntityRepository(Bus)
export class BusRepository extends Repository<Bus> {
    /**
     * 앞서 조회한 정류장 아이디를 이용해 해당 정류장을 지나는 버스 ID들, 버스 이름들, 버스 순번들 조회
     * @param busStationId 정류장 아이디
     * @returns 
     */ 
    async findBussByStationId(busStationId: number): Promise<Bus[]> {
        return this.createQueryBuilder('bus')
            .where('bus.busStationId = :busStationId', { busStationId })
            .select(['bus.busId', 'bus.busName', 'bus.sequence'])
            .getMany();
    }
}