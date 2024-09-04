import { EntityRepository, Repository } from "typeorm";
import { TrafficCollection } from "../entity/TrafficCollection";
import { CollectionInsert } from "../dto/request/CollectionInsert";
import { CollectionNameUpdate } from "../dto/request/CollectionNameUpdate";

@EntityRepository(TrafficCollection)
export class TrafficCollectionRepository extends Repository<TrafficCollection> {

    /**
     * 교통 컬렉션 등록 함수(교통 컬렉션 테이블)
     * @param collectionInsert 교통 컬렉션 삽입 dto
     * @param user 해당 유저
     * @returns 
     */
    async insertTrafficCollection(collectionInsert: CollectionInsert, userId: number): Promise<TrafficCollection> {
        const trafficCollection = TrafficCollection.createTrafficCollection(
            collectionInsert.getName(),
            true,
            userId
        );

        return await this.save(trafficCollection);
    }

    /**
     * 교통 컬렉션 삭제 함수
     * @param collectionId 교통 컬렉션 id
     * @param user 해당 유저
     */
    async deleteTrafficCollection(collectionId: number, userId: number) {
        await this.createQueryBuilder()
            .delete()
            .from(TrafficCollection)
            .where('id = :collectionId', { collectionId })
            .andWhere('user_Id = :userId', { userId })
            .execute();
    }

    /**
     * 컬렉션 ID와 사용자 ID로 해당 교통 컬렉션 조회
     * @param collectionId 컬렉션 아이디
     * @param userId 유저 아이디
     * @returns 
     */
    async findTrafficCollectionByCollectionIdAndUserId(collectionId: number, userId: number) {
        return await this.createQueryBuilder("trafficCollcection")
            .where('id = :collectionId', { collectionId })
            .andWhere('user_id = :userId', { userId })
            .getOne()
    }
    
    /**
     * 교통 컬렉션 수정 함수(교통 컬렉션 테이블)
     * @param collectionUpdate 교통 컬렉션 수정 dto
     * @param user 해당 유저
     */
    async updateTrafficCollection(collectionNameUpdate: CollectionNameUpdate, userId: number) {
        await this.createQueryBuilder()
        .update(TrafficCollection)
        .set({ name: collectionNameUpdate.getName() })
        .where("id = :collectionId", { collectionId: collectionNameUpdate.getCollectionId() })
        .andWhere('user_Id = :userId', { userId })
        .execute()
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
            .orderBy("trafficCollection.id", "ASC")
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
            .leftJoinAndSelect("transportations.transportationNumbers", "transportationNumbers")
            .where("trafficCollection.user_id = :userId", { userId })
            .andWhere("trafficCollection.id = :collectionId", { collectionId })
            .select([
                "trafficCollection.id",
                "trafficCollection.name",
                "trafficCollectionDetails.status",
                "transportations.route",
                "transportations.transportationName",
                "transportations.stationName",
                "transportationNumbers.numbers"
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

    /**
     * 유저 아이디와 choice값이 true인 컬렉션의 시간에 따른 status값을 조회하여 해당 컬렉션의 상세정보들 조회
     * @param userId 유저 아이디
     * @param status 상태(goToWork or goHome)
     * @returns 
     */
    async findMainTrafficCollection(userId: number, status: string) {
        return await this.createQueryBuilder("trafficCollection")
            .leftJoinAndSelect("trafficCollection.trafficCollectionDetails", "trafficCollectionDetails")
            .leftJoinAndSelect("trafficCollectionDetails.transportations", "transportations")
            .where("trafficCollection.user_id = :userId", { userId })
            .andWhere("trafficCollection.choice = true")
            .andWhere("trafficCollectionDetails.status = :status", { status })
            .select([
                "trafficCollection.id",
                "trafficCollection.name",
                "trafficCollectionDetails.id",
                "trafficCollectionDetails.status",
                "transportations.id",
                "transportations.route",
                "transportations.transportationName",
                "transportations.stationName",
            ])
            .getOne();
    }    
}