import { Inject, Service } from "typedi";
import { UserRepository } from "../repository/User.Repository.js";
import { CollectionInsert } from "../dto/request/CollectionInsert.js";
import { InjectRepository } from "typeorm-typedi-extensions";
import { CollectionUpdate } from "../dto/request/CollectionUpdate.js";
import { TrafficCollectionRepository } from "../repository/TrafficCollection.Reposiotry.js";
import { TrafficCollectionDetailRepository } from "../repository/TrafficCollectionDetail.Repository.js";
import { TransportationDetailDto } from "../dto/request/TransportationDetailDto.js";
import { TrafficCollection } from "../entity/TrafficCollection.js";
import {TransportationRepository } from "../repository/Transportation.Repository.js";
import { TransportationNumberRepository } from "../repository/TransportationNumber.Repository.js";
import { CollectionChoice } from "../dto/request/CollectionChoice.js";

@Service()
export class TrafficService {

    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository,
        @InjectRepository(TrafficCollectionRepository) private trafficCollectionRepository: TrafficCollectionRepository,
        @InjectRepository(TrafficCollectionDetailRepository) private trafficCollectionDetailRepository: TrafficCollectionDetailRepository,
        @InjectRepository(TransportationRepository) private transportationRepository: TransportationRepository,
        @InjectRepository(TransportationNumberRepository) private transportationNumberRepository: TransportationNumberRepository,
    ) {}

    /**
     * 교통 컬렉션 등록 함수
     * @param collectionInsert 교통 컬렉션 등록 dto 
     * @param userId 사용자 id
     */
    async penetrateTrafficCollection(collectionInsert: CollectionInsert, userId: number) {
        const user = await this.userRepository.findUserById(userId);

        const trafficCollection = await this.trafficCollectionRepository.insertTrafficCollection(collectionInsert, user);
        const details = [];

        if (collectionInsert.getGoToWork()) {
            const goToWorkDetail = await this.penetrateTrafficCollectionDetail(collectionInsert.getGoToWork(), trafficCollection);
            details.push(goToWorkDetail);
        }

        if (collectionInsert.getGoHome()) {
            const goHomeDetail = await this.penetrateTrafficCollectionDetail(collectionInsert.getGoHome(), trafficCollection);
            details.push(goHomeDetail);
        }

        trafficCollection.trafficCollectionDetails = details;
    }
    /**
     * 교통 컬렉션 등록 함수(교통 컬렉션 상세 정보)
     * @param detailDto 교통 컬렉션 상세(상태) dto
     * @param trafficCollection 교통 컬렉션
     */
    private async penetrateTrafficCollectionDetail(detailDto: TransportationDetailDto, trafficCollection: TrafficCollection) {
        const detail = await this.trafficCollectionDetailRepository.insertTrafficCollectionDetail(detailDto, trafficCollection);

        const departure = await this.transportationRepository.insertTransportation(detailDto.getDeparture(), detail);
        const arrival = await this.transportationRepository.insertTransportation(detailDto.getArrival(), detail);

        await this.transportationNumberRepository.insertTransportationNumbers(detailDto.getDeparture().getNumbers(), departure);
        await this.transportationNumberRepository.insertTransportationNumbers(detailDto.getArrival().getNumbers(), arrival);

        detail.transportations = [departure, arrival];
    }

     /**
     * 교통 컬렉션 삭제 함수
     * @param userId 유저 아이디
     * @param collectionId 교통 컬렉션 ID
     */
     async eraseTrafficCollection(userId: number, collectionId: number) {
        const user = await this.userRepository.findUserById(userId);

        await this.trafficCollectionRepository.deleteTrafficCollection(collectionId, user);
    }
    /**
     * 교통 컬렉션 수정 함수
     * @param collectionUpdate 교통 컬렉션 수정 dto
     * @param userId 유저 아이디
     */
    
    /**
     * 교통 컬렉션 수정 함수
     * @param collectionUpdate 교통 컬렉션 수정 dto
     * @param userId 유저 아이디
     */
    async modifyTrafficCollection(collectionUpdate: CollectionUpdate, userId: number) {
        const user = await this.userRepository.findUserById(userId);
        
        // 기존의 상세 정보를 삭제
        const trafficCollection = await this.trafficCollectionRepository.findOne({ where: { id: collectionUpdate.getCollectionId(), user: user } });

        await this.trafficCollectionDetailRepository.deleteTrafficCollectionDetailsByCollectionId(trafficCollection.id);

        // 새로운 상세 정보를 삽입
        const details = [];

        if (collectionUpdate.getGoToWork()) {
            const goToWorkDetail = await this.penetrateTrafficCollectionDetail(collectionUpdate.getGoToWork(), trafficCollection);
            details.push(goToWorkDetail);
        }

        if (collectionUpdate.getGoHome()) {
            const goHomeDetail = await this.penetrateTrafficCollectionDetail(collectionUpdate.getGoHome(), trafficCollection);
            details.push(goHomeDetail);
        }

        trafficCollection.trafficCollectionDetails = details;

        await this.trafficCollectionRepository.updateTrafficCollection(collectionUpdate, user);
    }

    /**
     * 유저 아이디로 모든 교통 컬렉션 조회
     * @param userId 유저 아이디
     * @returns 유저의 모든 교통 컬렉션
     */
    async bringTrafficCollectionsByUserId(userId: number, currentTime: Date) {
        const collections = await this.trafficCollectionRepository.findTrafficCollectionsByUserId(userId);
    
        const currentHour = currentTime.getHours();
    
        // 필터링 로직 추가
        collections.forEach(collection => {
            collection.trafficCollectionDetails = collection.trafficCollectionDetails.filter(detail => {
                if (currentHour >= 14 || currentHour < 2) {
                    return detail.status === "goHome";
                } else {
                    return detail.status === "goToWork";
                }
            });
        });
    
        return collections;
    }

    /**
     * 특정 교통 컬렉션 조회
     * @param userId 유저 아이디
     * @param collectionId 교통 컬렉션 아이디
     * @returns 특정 교통 컬렉션 상세 정보
     */
    async bringTrafficCollectionDetailsById(userId: number, collectionId: number) {

        return await this.trafficCollectionRepository.findTrafficCollectionDetailsById(userId, collectionId);
    }

    /**
     * 특정 교통 컬렉션 선택 
     * @param userId 유저 아이디
     * @param collectionId 교통 컬렉션 아이디
     */
    async choiceTrafficCollection(userId: number, collectionId: number) { 
        const user = await this.userRepository.findUserById(userId);

        await this.trafficCollectionRepository.updateAllChoicesToFalse(user.id);

        await this.trafficCollectionRepository.updateChoiceByCollectionId(user.id, collectionId);
    }

    /**
     * 메인 화면 교통 컬렉션 조회 함수
     * @param userId 유저 아이디
     * @returns 
     */
    async bringMainTrafficCollection(userId: number) {
        
        const currentHour = new Date().getHours();
        const status = currentHour >= 14 || currentHour < 2 ? 'goHome' : 'goToWork';


        return await this.trafficCollectionRepository.findMainTrafficCollection(userId, status);
    }

    /**
     * 유저 아이디와 컬렉션 아이디, 컬렉션 상태를 조회해 반대 상태의 정보 조회
     * @param userId 유저 아이디
     * @param collectionId 컬렉션 아이디
     * @param currentStatus 컬렉션의 상태(goToWokrt or goHome)
     * @returns 
     */
    async changeTrafficRoute(userId: number, collectionId: number, currentStatus: 'goToWork' | 'goHome') {
        const user = await this.userRepository.findUserById(userId);

        const newStatus = currentStatus === 'goToWork' ? 'goHome' : 'goToWork';

        return await this.trafficCollectionRepository.findChangeTrafficRoute(userId, collectionId, newStatus);
    }

}
