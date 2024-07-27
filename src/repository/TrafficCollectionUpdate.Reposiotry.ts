import { EntityRepository, Repository } from "typeorm";
import { TrafficCollection } from "../entity/TrafficCollection.js";
import { CollectionUpdate } from "../dto/request/CollectionUpdate.js";
import { TransportationDetailDto } from "../dto/request/TransportationDetailDto.js";
import { StationDto } from "../dto/request/StationDto.js";
import { User } from "../entity/User.js";
import { TrafficCollectionDetail } from "../entity/TrafficCollectionDetail.js";
import { Transportation } from "../entity/Transportation.js";
import { TransportationNumber } from "../entity/TransportationNumber.js";

@EntityRepository(TrafficCollection)
export class TrafficCollectionUpdateRepository extends Repository<TrafficCollection> {

    /**
     * 
     * @param collectionUpdate 교통 컬렉션 수정 dto
     * @param user 해당 유저
     */
    async updateTrafficCollection(collectionUpdate: CollectionUpdate, user: User) {
        const trafficCollection = await this.findOne({ where: { id: collectionUpdate.getCollectionId(), user } });

        if (!trafficCollection) {
            throw new Error('Traffic collection not found');
        }

        trafficCollection.name = collectionUpdate.getName();

        // 존재하는 상세 정보 삭제
        await this.manager.createQueryBuilder()
            .delete()
            .from(TrafficCollectionDetail)
            .where("trafficCollection = :trafficCollectionId", { trafficCollectionId: trafficCollection.id })
            .execute();

        const details = [];

        if (collectionUpdate.getGoToWork()) {
            const goToWorkDetail = await this.insertTrafficCollectionDetail(collectionUpdate.getGoToWork(), trafficCollection);
            details.push(goToWorkDetail);
        }

        if (collectionUpdate.getGoHome()) {
            const goHomeDetail = await this.insertTrafficCollectionDetail(collectionUpdate.getGoHome(), trafficCollection);
            details.push(goHomeDetail);
        }

        trafficCollection.trafficCollectionDetails = details;

        await this.manager.save(TrafficCollection, trafficCollection);
    }

    /**
     * 교통 컬렉션 수정된 데이터 등록 함수(교통 컬렉션 상세 테이블)
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
     * 교통 컬렉션 수정된 데이터 등록 함수(교통 수단, 교통 수단 넘버 테이블)
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
