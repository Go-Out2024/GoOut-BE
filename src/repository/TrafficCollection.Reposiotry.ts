import { EntityRepository, Repository } from "typeorm";
import { TrafficCollection } from "../entity/TrafficCollection.js";
import { CollectionInsert } from "../dto/request/CollectionInsert.js";
import { User } from "../entity/User";
import { CollectionUpdate } from "../dto/request/CollectionUpdate.js";

@EntityRepository(TrafficCollection)
export class TrafficCollectionRepository extends Repository<TrafficCollection> {

    /**
     * 교통 컬렉션 등록 함수(교통 컬렉션 테이블)
     * @param collectionInsert 교통 컬렉션 삽입 dto
     * @param user 해당 유저
     * @returns 
     */
    async insertTrafficCollection(collectionInsert: CollectionInsert, user: User): Promise<TrafficCollection> {
        const trafficCollection = TrafficCollection.createTrafficCollection(
            collectionInsert.getName(),
            true,
            user.id
        );

        trafficCollection.user = user;
        return await this.save(trafficCollection);
    }

    /**
     * 교통 컬렉션 삭제 함수
     * @param collectionId 교통 컬렉션 id
     * @param user 해당 유저
     */
    async deleteTrafficCollection(collectionId: number, user: User) {
        
        const trafficCollection = await this.findOne({ where: { id: collectionId, user: user } });

        await this.remove(trafficCollection);
    }

    /**
     * 교통 컬렉션 수정 함수(교통 컬렉션 테이블)
     * @param collectionUpdate 교통 컬렉션 수정 dto
     * @param user 해당 유저
     */
    async updateTrafficCollection(collectionUpdate: CollectionUpdate, user: User) {
        const trafficCollection = await this.findOne({ where: { id: collectionUpdate.getCollectionId(), user: user } });

        trafficCollection.name = collectionUpdate.getName();

        await this.save(trafficCollection);
    }

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

    /**
     * 해당 유저의 모든 교통 컬렉션 choice -> false 처리
     * @param userId 유저 아이디
     */
    async updateAllChoicesToFalse(userId: number) {
        await this.createQueryBuilder()
            .update(TrafficCollection)
            .set({ choice: false })
            .where("user_id = userId", { userId })
            .execute();
    }

    /**
     * 유저가 선택한 교통 컬렉션 choice -> true 처리
     * @param userId 유저 아이디
     * @param collectionId 교통 컬렉션 아이디
     */
    async updateChoiceByCollectionId(userId: number, collectionId: number) {
        await this.createQueryBuilder()
            .update(TrafficCollection)
            .set({ choice: true })
            .where("user_id = :userId AND id = :collectionId", { userId, collectionId })
            .execute();
    }

}
