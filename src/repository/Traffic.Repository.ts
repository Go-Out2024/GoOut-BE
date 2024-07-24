import { EntityRepository, Repository } from "typeorm";
import { TrafficCollection } from "../entity/TrafficCollection.js";
import { CollectionInsert } from "../dto/request/CollectionInsert.js";
import { TransportationDetailDto } from "../dto/request/TransportationDetailDto.js";
import { StationDto } from "../dto/request/StationDto.js";
import { User } from "../entity/User.js";
import { TrafficCollectionDetail } from "../entity/TrafficCollectionDetail.js";
import { Transportation } from "../entity/Transportation.js";
import { TransportationNumber } from "../entity/TransportationNumber.js";

@EntityRepository(TrafficCollection)
export class TrafficRepository extends Repository<TrafficCollection> {

    async insertTrafficCollection(collectionInsert: CollectionInsert, userId: number) {
        const user = await this.manager.findOne(User, userId);

        const trafficCollection = new TrafficCollection();
        trafficCollection.name = collectionInsert.getName();
        trafficCollection.user = user;

        const details = [];

        if (collectionInsert.getGoToWork()) {
            const goToWorkDetail = await this.insertTrafficCollectionDetail(collectionInsert.getGoToWork(), trafficCollection);
            details.push(goToWorkDetail);
        }

        if (collectionInsert.getGoHome()) {
            const goHomeDetail = await this.insertTrafficCollectionDetail(collectionInsert.getGoHome(), trafficCollection);
            details.push(goHomeDetail);
        }

        trafficCollection.trafficCollectionDetails = details;

        await this.manager.save(TrafficCollection, trafficCollection);
    }

    private async insertTrafficCollectionDetail(detailDto: TransportationDetailDto, trafficCollection: TrafficCollection): Promise<TrafficCollectionDetail> {
        const detail = new TrafficCollectionDetail();
        detail.status = detailDto.getStatus();
        detail.trafficCollection = trafficCollection;

        const transportations = [];

        const departure = await this.insertTransportation(detailDto.getDeparture(), detail);
        transportations.push(departure);

        const arrival = await this.insertTransportation(detailDto.getArrival(), detail);
        transportations.push(arrival);

        detail.transportations = transportations;

        await this.manager.save(TrafficCollectionDetail, detail);

        return detail;
    }

    private async insertTransportation(stationDto: StationDto, detail: TrafficCollectionDetail): Promise<Transportation> {
        const transportation = new Transportation();
        transportation.route = stationDto.getRoute();
        transportation.transportationName = stationDto.getType();
        transportation.stationName = stationDto.getName();
        transportation.trafficCollectionDetail = detail;

        const transportationNumbers = stationDto.getNumbers().map(number => {
            const transportationNumber = new TransportationNumber();
            transportationNumber.numbers = number;
            transportationNumber.transportation = transportation;
            return transportationNumber;
        });

        transportation.transportationNumbers = transportationNumbers;

        await this.manager.save(Transportation, transportation);
        await this.manager.save(TransportationNumber, transportationNumbers);

        return transportation;
    }
}
