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
import { SubwayStationRepository } from "../repository/SubwayStation.Repository.js";
import { BusStationRepository } from "../repository/BusStation.Repository.js";
import { BusRepository } from "../repository/Bus.Repository.js";
import { envs } from "../config/environment.js";
import axios from 'axios';
import xml2js from 'xml2js';

@Service()
export class TrafficService {

    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository,
        @InjectRepository(TrafficCollectionRepository) private trafficCollectionRepository: TrafficCollectionRepository,
        @InjectRepository(TrafficCollectionDetailRepository) private trafficCollectionDetailRepository: TrafficCollectionDetailRepository,
        @InjectRepository(TransportationRepository) private transportationRepository: TransportationRepository,
        @InjectRepository(TransportationNumberRepository) private transportationNumberRepository: TransportationNumberRepository,
        @InjectRepository(SubwayStationRepository) private subwayStationRepository: SubwayStationRepository,
        @InjectRepository(BusStationRepository) private busStationRepository: BusStationRepository,
        @InjectRepository(BusRepository) private busRepository: BusRepository,
    ) {}

    /**
     * 교통 컬렉션 등록 함수
     * @param collectionInsert 교통 컬렉션 등록 dto 
     * @param userId 사용자 id
     */
    async penetrateTrafficCollection(collectionInsert: CollectionInsert, userId: number) {
        const trafficCollection = await this.trafficCollectionRepository.insertTrafficCollection(collectionInsert, userId);
        await this.verifyInsertTrafficCollectionStatus(collectionInsert, trafficCollection);
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
    }

     /**
     * 교통 컬렉션 삭제 함수
     * @param userId 유저 아이디
     * @param collectionId 교통 컬렉션 ID
     */
     async eraseTrafficCollection(userId: number, collectionId: number) {
        await this.trafficCollectionRepository.deleteTrafficCollection(collectionId, userId);
    }
    
    /**
     * 교통 컬렉션 수정 함수
     * @param collectionUpdate 교통 컬렉션 수정 dto
     * @param userId 유저 아이디
     */
    async modifyTrafficCollection(collectionUpdate: CollectionUpdate, userId: number) {
        const user = await this.userRepository.findUserById(userId);
        const trafficCollection = await this.trafficCollectionRepository.findTrafficCollectionByCollectionIdAndUserId(collectionUpdate.getCollectionId(), userId);
        await this.trafficCollectionDetailRepository.deleteTrafficCollectionDetailsByCollectionId(trafficCollection.id);
        await this.verifyUpdateTrafficCollectionStatus(collectionUpdate, trafficCollection);
        await this.trafficCollectionRepository.updateTrafficCollection(collectionUpdate, userId);
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
        await this.trafficCollectionRepository.updateAllChoicesToFalse(userId);
        await this.trafficCollectionRepository.updateChoiceByCollectionId(userId, collectionId);
    }

    /**
     * 메인 화면 교통 컬렉션 조회 함수
     * @param userId 유저 아이디
     * @returns 
     */
    async bringMainTrafficCollection(userId: number) {
        let result: any = {};
        const currentHour = new Date().getHours();
        const status = currentHour >= 14 || currentHour < 2 ? 'goHome' : 'goToWork';
        const collection = await this.trafficCollectionRepository.findMainTrafficCollection(userId, status);
        result.collection = collection;
        const details = collection.trafficCollectionDetails.find(detail => detail.status === status);
        const arrivalTransportation = details.transportations.find(transportation => transportation.route === 'departure');
        const numbers = await this.transportationNumberRepository.findTransportationNumbers(arrivalTransportation.id);
        if (arrivalTransportation.transportationName === 'Subway') {
            const subwayArrivalInfo = await this.bringSubwayArrivalInfo(arrivalTransportation.stationName, numbers);
            result.subwayArrivalInfo = subwayArrivalInfo;
        } else if (arrivalTransportation.transportationName === 'Bus') {
            const busStations = await this.busStationRepository.findByStationName(arrivalTransportation.stationName);
                return await Promise.all(
                busStations.map(async (station) => {
                    const busArrivalInfo = await this.bringBusArrivalInfo(station.stationNum, numbers);
                    return {
                        busArrivalInfo,
                    };
                })
            );
        }
        return result
    }

    /**
     * 유저 아이디와 컬렉션 아이디, 컬렉션 상태를 조회해 반대 상태의 정보 조회
     * @param userId 유저 아이디
     * @param currentStatus 컬렉션의 상태(goToWokrt or goHome)
     * @returns 
     */
    async changeTrafficRoute(userId: number, currentStatus: 'goToWork' | 'goHome') {
        let result: any = {};
        const newStatus = currentStatus === 'goToWork' ? 'goHome' : 'goToWork';
        const collection = await this.trafficCollectionRepository.findMainTrafficCollection(userId, newStatus);
        result.collection = collection;
        const details = collection.trafficCollectionDetails.find(detail => detail.status === newStatus);
        const arrivalTransportation = details.transportations.find(transportation => transportation.route === 'departure');
        const numbers = await this.transportationNumberRepository.findTransportationNumbers(arrivalTransportation.id);
        if (arrivalTransportation.transportationName === 'Subway') {
            const subwayArrivalInfo = await this.bringSubwayArrivalInfo(arrivalTransportation.stationName, numbers);
            result.subwayArrivalInfo = subwayArrivalInfo;
        } else if (arrivalTransportation.transportationName === 'Bus') {
            const busStations = await this.busStationRepository.findByStationName(arrivalTransportation.stationName);
                return await Promise.all(
                busStations.map(async (station) => {
                    const busArrivalInfo = await this.bringBusArrivalInfo(station.stationNum, numbers);
                    return {
                        busArrivalInfo,
                    };
                })
            );
        }
        return result
    }

    /**
     * 교통 컬렉션 등록 시 교통 컬렉션 상태 검증 함수
     * @param collectionInsert 컬렉션 등록 dto
     * @param trafficCollection 교통 컬렉션
     */
    public async verifyInsertTrafficCollectionStatus(collectionInsert: CollectionInsert, trafficCollection: TrafficCollection){
        if (collectionInsert.getGoToWork()) {
            await this.penetrateTrafficCollectionDetail(collectionInsert.getGoToWork(), trafficCollection);
        }
        if (collectionInsert.getGoHome()) {
            await this.penetrateTrafficCollectionDetail(collectionInsert.getGoHome(), trafficCollection);
        }
    }

    /**
     * 교통 컬렉션 수정 시 교통 컬렉션 상태 검증 함수
     * @param collectionInsert 컬렉션 등록 dto
     * @param trafficCollection 교통 컬렉션
     */
    public async verifyUpdateTrafficCollectionStatus(collectionUpdate: CollectionUpdate, trafficCollection: TrafficCollection){
        if (collectionUpdate.getGoToWork()) {
            await this.penetrateTrafficCollectionDetail(collectionUpdate.getGoToWork(), trafficCollection);
        }
        if (collectionUpdate.getGoHome()) {
            await this.penetrateTrafficCollectionDetail(collectionUpdate.getGoHome(), trafficCollection);
        }
    }

    private subwayApiKey: string = envs.apikey.subwayapikey;
    private busApiKey: string = envs.apikey.busapikey;
    // Subway의 경우
    private async bringSubwayArrivalInfo(stationName: string, numbers: string[]) {
        const subwayApiUrl = `http://swopenAPI.seoul.go.kr/api/subway/${this.subwayApiKey}/json/realtimeStationArrival/0/5/${encodeURIComponent(stationName)}`;
        try {
            const response = await axios.get(subwayApiUrl);
            const data = response.data;

            if (data.RESULT && data.RESULT.code !== 'INFO-000') {
                throw new Error(`Error from API: ${data.RESULT.message}`);
            }

            const arrivalInfo = data.realtimeArrivalList
                .filter(info => numbers.includes(info.subwayId))
                .map(info => ({
                    stationName: info.statnNm,
                    line: info.subwayId,
                    direction: info.trainLineNm,
                    firstArrivalMessage: info.arvlMsg2,
                    secondArrivalMessage: info.arvlMsg3,
                    destination: info.bstatnNm
                }));

            return arrivalInfo;
        } catch (error) {
            console.error('Failed to fetch subway arrival info:', error.message);
            throw new Error('지하철 실시간 도착 정보를 가져오는 중 오류가 발생했습니다.');
        }
    }
    /**
     * 정류소 고유번호를 이용하여 api 요청 후 받은 데이터 중 버스 번호가 numbers와 동일한 버스 실시간 도착 데이터만 추출
     * @param stationNum 정류소 고유번호
     * @param numbers 버스 번호들
     * @returns 
     */
    private async bringBusArrivalInfo(stationNum: number, numbers: string[]) {
        const formattedStationNum = stationNum.toString().padStart(5, '0');
        const busApiUrl = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid?serviceKey=${this.busApiKey}&arsId=${formattedStationNum}`;
        try {
            const response = await axios.get(busApiUrl);
            const data = response.data;

            const parsedData = await xml2js.parseStringPromise(data, { explicitArray: false });

            const itemList = parsedData.ServiceResult.msgBody.itemList;
            if (!itemList) {
                throw new Error('Item list not found in response');
            }

            const busArrivalInfo = Array.isArray(itemList) ? itemList : [itemList];

            return busArrivalInfo
                .filter(item => numbers.includes(item.busRouteAbrv))
                .map(item => ({
                    nxtStn: item.nxtStn || '정보 없음', 
                    busRouteAbrv: item.busRouteAbrv || '정보 없음',
                    arrmsg1: item.arrmsg1 || '정보 없음',
                    arrmsg2: item.arrmsg2 || '정보 없음'
                }));
            
        } catch (error) {
            console.error('버스 도착 예정 정보 요청 오류:', error);
            throw new Error('버스 실시간 도착 정보를 가져오는 중 오류가 발생했습니다.');
        }
    }
}
