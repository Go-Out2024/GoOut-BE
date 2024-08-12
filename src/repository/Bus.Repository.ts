import { Entity, EntityRepository, Repository } from 'typeorm';
import { Bus } from '../entity/Bus.js';

@EntityRepository(Bus)
export class BusRepository extends Repository<Bus> {
    async findByStationId(stationId: number): Promise<{ busId: number, busName: string, sequence: number}[]> {
        return this.createQueryBuilder('bus')
            .select(['bus.busId', 'bus.busName', 'bus.sequence'])
            .where('bus.busStationId = :stationId', { stationId })
            .orderBy('bus.sequence', 'ASC')
            .getRawMany();
    }
}