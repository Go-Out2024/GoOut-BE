import { EntityRepository, Repository } from "typeorm";
import { TrafficCollectionDetail } from "../entity/TrafficCollectionDetail";
import { TrafficCollection } from "../entity/TrafficCollection";
import { TransportationDetailDto } from "../dto/request/TransportationDetailDto";

@EntityRepository(TrafficCollectionDetail)
export class TrafficCollectionDetailRepository extends Repository<TrafficCollectionDetail> {

    /**
     * 교통 컬렉션 등록 함수(교통 컬렉션 상세 정보)
     * @param detailDto 교통 컬렉션 상세(상태) dto
     * @param trafficCollection 교통 컬렉션
     */
    async insertTrafficCollectionDetail(detailDto: TransportationDetailDto, trafficCollection: TrafficCollection): Promise<TrafficCollectionDetail> {
        const detail = TrafficCollectionDetail.createTrafficCollectionDetail(
            detailDto.getStatus(),
            trafficCollection.id
        );
        return await this.save(detail);
    }

    /**
     * 교통 컬렉션 아이디를 조회해 교통 컬렉션 상세 정보 삭제 함수
     * @param trafficCollectionId 교통 컬렉션 아이디
     */
    async deleteTrafficCollectionDetailsByCollectionId(trafficCollectionId: number) {
        await this.createQueryBuilder()
            .delete()
            .from(TrafficCollectionDetail)
            .where("trafficCollection = :trafficCollectionId", { trafficCollectionId })
            .execute();
    }
}
