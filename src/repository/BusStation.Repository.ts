import { EntityRepository, Repository } from 'typeorm';
import { BusStation } from '../entity/BusStation';

@EntityRepository(BusStation)
export class BusStationRepository extends Repository<BusStation> {
    async findCoordinatesByBusStationName(stationName: string) {
        return this.findOne({ where: { stationName }});
    }
}

