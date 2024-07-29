import { EntityRepository, Repository } from "typeorm";
import { Transportation } from "../entity/Transportation.js";
import { StationDto } from "../dto/request/StationDto.js";
import { TrafficCollectionDetail } from "../entity/TrafficCollectionDetail.js";
import { TransportationNumber } from "../entity/TransportationNumber.js";

@EntityRepository(Transportation)
export class TransportationRepository extends Repository<Transportation> {

    /**
     * 교통 컬렉션 등록 함수(교통 수단, 교통 수단 넘버 테이블)
     * @param stationDto 교통 컬렉션 역(이름, 타입, 경로, 번호) dto
     * @param detail 교통 컬렉션 상세
     * @returns 
     */
    async insertTransportation(stationDto: StationDto, detail: TrafficCollectionDetail): Promise<Transportation> {
        const transportation = Transportation.createTransportation(
            stationDto.getRoute(),
            stationDto.getType(),
            stationDto.getName(),
            detail.id
        );

        transportation.trafficCollectionDetail = detail;

        return await this.save(transportation);
    }
}