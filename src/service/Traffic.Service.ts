import { Inject, Service } from "typedi";
import { UserRepository } from "../repository/User.Repository.js";
import { TrafficCollectionDeleteRepository } from "../repository/TrafficCollectionDelete.Repository.js";
import { CollectionInsert } from "../dto/request/CollectionInsert.js";
import { InjectRepository } from "typeorm-typedi-extensions";
import { TrafficCollectionInsertRepository } from "../repository/TrafficCollectionInsert.Repository.js";
import { CollectionUpdate } from "../dto/request/CollectionUpdate.js";
import { TrafficCollectionUpdateRepository } from "../repository/TrafficCollectionUpdate.Reposiotry.js";
import { TrafficCollectionSelectRepository } from "../repository/TrafficCollectionSelect.Repository.js";

@Service()
export class TrafficService {

    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository,
        @InjectRepository(TrafficCollectionInsertRepository) private trafficCollectionInsertRepository: TrafficCollectionInsertRepository,
        @InjectRepository(TrafficCollectionDeleteRepository) private trafficCollectionDeleteRepository: TrafficCollectionDeleteRepository,
        @InjectRepository(TrafficCollectionUpdateRepository) private trafficCollectionUpdateRepository: TrafficCollectionUpdateRepository,
        @InjectRepository(TrafficCollectionSelectRepository) private trafficCollectionSelectRepository: TrafficCollectionSelectRepository
    ) { }
    /**
     * 교통 컬렉션 등록 함수
     * @param collectionInsert 교통 컬렉션 등록 dto 
     * @param userId 사용자 id
     */
    async penetrateTrafficCollection(collectionInsert: CollectionInsert, userId: number) {
        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        await this.trafficCollectionInsertRepository.insertTrafficCollection(collectionInsert, user);
    }

    /**
     * 교통 컬렉션 삭제 함수
     * @param userId 유저 아이디
     * @param collectionId 교통 컬렉션 ID
     */
    async eraseTrafficCollection(userId: number, collectionId: number) {
        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        await this.trafficCollectionDeleteRepository.deleteTrafficCollection(collectionId, user);
    }

    /**
     * 교통 컬렉션 수정 함수
     * @param collectionUpdate 교통 컬렉션 수정 dto
     * @param userId 유저 아이디
     */
    async modifyTrafficCollection(collectionUpdate: CollectionUpdate, userId: number) {
        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        await this.trafficCollectionUpdateRepository.updateTrafficCollection(collectionUpdate, user);
    }

    /**
     * 유저 아이디로 모든 교통 컬렉션 조회
     * @param userId 유저 아이디
     * @returns 유저의 모든 교통 컬렉션
     */
    async bringTrafficCollectionsByUserId(userId: number) {
        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        return await this.trafficCollectionSelectRepository.findTrafficCollectionsByUserId(userId);
    }

    /**
     * 특정 교통 컬렉션 조회
     * @param userId 유저 아이디
     * @param collectionId 교통 컬렉션 아이디
     * @returns 특정 교통 컬렉션 상세 정보
     */
    async bringTrafficCollectionDetailsById(userId: number, collectionId: number) {
        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        return await this.trafficCollectionSelectRepository.findTrafficCollectionDetailsById(userId, collectionId);
    }
}