import { EntityRepository, Repository } from "typeorm";
import { TrafficCollection } from "../entity/TrafficCollection.js";
import { TrafficCollectionDetail } from "../entity/TrafficCollectionDetail.js";

@EntityRepository(TrafficCollection)
export class TrafficCollectionSelectRepository extends Repository<TrafficCollection> {

    /**
     * 유저 아이디로 모든 교통 컬렉션 조회
     * @param userId 유저 아이디
     * @returns 유저의 모든 교통 컬렉션
     */
    async findTrafficCollectionsByUserId(userId: number) {
        return await this.createQueryBuilder("trafficCollection")
            .leftJoinAndSelect("trafficCollection.trafficCollectionDetails", "trafficCollectionDetails")
            .leftJoinAndSelect("trafficCollectionDetails.transportations", "transportations")
            .where("trafficCollection.user_id = :userId", { userId })
            .select([
                "trafficCollection.id",
                "trafficCollection.name",
                "trafficCollectionDetails.status",
                "transportations.stationName"
            ])
            .getMany();
    }

    /**
     * 특정 교통 컬렉션 조회
     * @param userId 유저 아이디
     * @param collectionId 교통 컬렉션 아이디
     * @returns 특정 교통 컬렉션 상세 정보
     */
    async findTrafficCollectionDetailsById(userId: number, collectionId: number) {
        return await this.createQueryBuilder("trafficCollection")
            .leftJoinAndSelect("trafficCollection.trafficCollectionDetails", "trafficCollectionDetails")
            .leftJoinAndSelect("trafficCollectionDetails.transportations", "transportations")
            .where("trafficCollection.user_id = :userId", { userId })
            .andWhere("trafficCollection.id = :collectionId", { collectionId })
            .select([
                "trafficCollection.id",
                "trafficCollection.name",
                "trafficCollectionDetails.status",
                "transportations.stationName"
            ])
            .getOne();
    }
}
