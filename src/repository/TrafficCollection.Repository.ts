import { EntityRepository, Repository } from "typeorm";
import { TrafficCollection } from "../entity/TrafficCollection.js";
import { User } from "../entity/User.js";
import { CollectionUpdate } from "../dto/request/CollectionUpdate.js";
import { TransportationDetailDto } from "../dto/request/TransportationDetailDto.js";
import { StationDto } from "../dto/request/StationDto.js";
import { TrafficCollectionDetail } from "../entity/TrafficCollectionDetail.js";
import { Transportation } from "../entity/Transportation.js";
import { TransportationNumber } from "../entity/TransportationNumber.js";

@EntityRepository(TrafficCollection)
export class TrafficCollectionRepository extends Repository<TrafficCollection> {

    async deleteTrafficCollection(collectionId: number, user: User) {
        
        const trafficCollection = await this.findOne({ where: { id: collectionId, user: user } });
        if (!trafficCollection) {
            throw new Error('해당 교통 컬렉션 아이디가 존재하지 않습니다.');
        }

        await this.remove(trafficCollection);
    }

    async updateTrafficCollection(collectionUpdate: CollectionUpdate, user: User) {
        // 교통 컬렉션을 찾습니다.
        const trafficCollection = await this.findOne({
            where: { id: collectionUpdate.getCollectionId(), user: user },
            relations: [
                "trafficCollectionDetails",
                "trafficCollectionDetails.transportations",
                "trafficCollectionDetails.transportations.transportationNumbers"
            ]
        });

        if (!trafficCollection) {
            throw new Error('해당 교통 컬렉션 없음.');
        }

        // 교통 컬렉션 이름을 업데이트합니다.
        trafficCollection.name = collectionUpdate.getName();

        // 기존 세부사항을 삭제합니다.
        await this.createQueryBuilder()
            .delete()
            .from(TrafficCollectionDetail)
            .where("traffic_collection_id = :id", { id: trafficCollection.id })
            .execute();

        // 새로운 세부사항을 추가합니다.
        if (collectionUpdate.getGoToWork()) {
            const goToWorkDetail = await this.createTrafficCollectionDetail(collectionUpdate.getGoToWork(), trafficCollection);
            trafficCollection.trafficCollectionDetails.push(goToWorkDetail);
        }

        if (collectionUpdate.getGoHome()) {
            const goHomeDetail = await this.createTrafficCollectionDetail(collectionUpdate.getGoHome(), trafficCollection);
            trafficCollection.trafficCollectionDetails.push(goHomeDetail);
        }

        // 업데이트된 교통 컬렉션을 저장합니다.
        await this.save(trafficCollection);
    }

    private async createTrafficCollectionDetail(detailDto: TransportationDetailDto, trafficCollection: TrafficCollection): Promise<TrafficCollectionDetail> {
        const detail = new TrafficCollectionDetail();
        detail.status = detailDto.getStatus();
        detail.trafficCollection = trafficCollection;

        // 교통 수단을 생성합니다.
        detail.transportations = await this.createTransportations(detailDto, detail);

        return detail;
    }

    private async createTransportations(detailDto: TransportationDetailDto, detail: TrafficCollectionDetail): Promise<Transportation[]> {
        const transportations = [];

        if (detailDto.getDeparture()) {
            const departure = await this.createTransportation(detailDto.getDeparture(), detail);
            transportations.push(departure);
        }

        if (detailDto.getArrival()) {
            const arrival = await this.createTransportation(detailDto.getArrival(), detail);
            transportations.push(arrival);
        }

        return transportations;
    }

    private async createTransportation(stationDto: StationDto, detail: TrafficCollectionDetail): Promise<Transportation> {
        const transportation = new Transportation();
        transportation.route = stationDto.getRoute();
        transportation.transportationName = stationDto.getType();
        transportation.stationName = stationDto.getName();
        transportation.trafficCollectionDetail = detail;

        // 교통 수단 번호를 생성합니다.
        transportation.transportationNumbers = await this.createTransportationNumbers(stationDto, transportation);

        return transportation;
    }

    private async createTransportationNumbers(stationDto: StationDto, transportation: Transportation): Promise<TransportationNumber[]> {
        const numbers = [];

        for (const number of stationDto.getNumbers()) {
            const transportationNumber = new TransportationNumber();
            transportationNumber.numbers = number;
            transportationNumber.transportation = transportation;

            await this.save(transportationNumber);
            numbers.push(transportationNumber);
        }

        return numbers;
    }

    /////////////////////////
    findByUser(user: User) {
        return this.find({
            where: { user: user },
            relations: [
                "trafficCollectionDetails",
                "trafficCollectionDetails.transportations"
            ]
        });
    }
}
