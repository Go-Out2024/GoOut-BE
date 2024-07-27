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
export class TrafficCollectionInsertRepository extends Repository<TrafficCollection> {

    /**
     * 교통 컬렉션 등록 함수(교통 컬렉션 테이블)
     * @param collectionInsert 교통 컬렉션 등록 dtd
     * @param user 해당 유저
     */
    async insertTrafficCollection(collectionInsert: CollectionInsert, user) {

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

    /**
     * 교통 컬렉션 등록 함수(교통 컬렉션 상세 테이블)
     * @param detailDto 교통 컬렉션 등록 상세(상태) dto
     * @param trafficCollection 교통 컬렉션
     * @returns 
     */
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

    /**
     * 교통 컬렉션 등록 함수(교통 수단, 교통 수단 넘버 테이블)
     * @param stationDto 교통 컬렉션 역(이름, 타입, 경로, 번호) dto
     * @param detail 교통 컬렉션 상세
     * @returns 
     */
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
