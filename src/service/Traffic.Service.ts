import { Inject, Service } from "typedi";
import { UserRepository } from "../repository/User.Repository";
import { CollectionInsert } from "../dto/request/CollectionInsert";
import { InjectRepository } from "typeorm-typedi-extensions";
import { CollectionDetailUpdate } from "../dto/request/CollectionDetailUpdate";
import { TrafficCollectionRepository } from "../repository/TrafficCollection.Reposiotry";
import { TrafficCollectionDetailRepository } from "../repository/TrafficCollectionDetail.Repository";
import { TransportationDetailDto } from "../dto/request/TransportationDetailDto";
import { TrafficCollection } from "../entity/TrafficCollection";
import { TransportationRepository } from "../repository/Transportation.Repository";
import { TransportationNumberRepository } from "../repository/TransportationNumber.Repository";
import { SubwayStationRepository } from "../repository/SubwayStation.Repository";
import { BusStationRepository } from "../repository/BusStation.Repository";
import {
  BusStationResult,
  StationResult,
  SubwayStationResult,
} from "../dto/values/StationResult";
import { Transportation } from "../entity/Transportation";
import { SubwayArrivalInfo } from "../dto/values/SubwayArrivalInfo";
import {
  BusArrivalInfo,
  BusStationInfo,
  Station,
} from "../dto/values/BusArrivalInfo";
import { SubwayApi } from "../util/publicData";
import { BusApi } from "../util/publicData";
import { CollectionNameUpdate } from "../dto/request/CollectionNameUpdate";
import { checkData } from "../util/checker";
import { ErrorResponseDto } from "../response/ErrorResponseDto";
import { ErrorCode } from "../exception/ErrorCode";
import { verifyarrivalList } from "../util/verify";

@Service()
export class TrafficService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(TrafficCollectionRepository)
    private trafficCollectionRepository: TrafficCollectionRepository,
    @InjectRepository(TrafficCollectionDetailRepository)
    private trafficCollectionDetailRepository: TrafficCollectionDetailRepository,
    @InjectRepository(TransportationRepository)
    private transportationRepository: TransportationRepository,
    @InjectRepository(TransportationNumberRepository)
    private transportationNumberRepository: TransportationNumberRepository,
    @InjectRepository(BusStationRepository)
    private busStationRepository: BusStationRepository,
    private subwayApi: SubwayApi,
    private busApi: BusApi
  ) {}

  /**
   * 교통 컬렉션 등록 함수
   * @param collectionInsert 교통 컬렉션 등록 dto
   * @param userId 사용자 id
   */
  async penetrateTrafficCollection(
    collectionInsert: CollectionInsert,
    userId: number
  ) {
    const trafficCollection =
      await this.trafficCollectionRepository.insertTrafficCollection(
        collectionInsert,
        userId
      );
    await this.verifyInsertTrafficCollectionStatus(
      collectionInsert,
      trafficCollection
    );
  }

  /**
   * 교통 컬렉션 등록 함수(교통 컬렉션 상세 정보)
   * @param detailDto 교통 컬렉션 상세(상태) dto
   * @param trafficCollection 교통 컬렉션
   */
  private async penetrateTrafficCollectionDetail(
    detailDto: TransportationDetailDto,
    trafficCollection: TrafficCollection
  ) {
    const detail =
      await this.trafficCollectionDetailRepository.insertTrafficCollectionDetail(
        detailDto,
        trafficCollection
      );
    const departure = await this.transportationRepository.insertTransportation(
      detailDto.getDeparture(),
      detail
    );
    const arrival = await this.transportationRepository.insertTransportation(
      detailDto.getArrival(),
      detail
    );
    await this.transportationNumberRepository.insertTransportationNumbers(
      detailDto.getDeparture().getNumbers(),
      departure
    );
    await this.transportationNumberRepository.insertTransportationNumbers(
      detailDto.getArrival().getNumbers(),
      arrival
    );
  }

  /**
   * 교통 컬렉션 삭제 함수
   * @param userId 유저 아이디
   * @param collectionId 교통 컬렉션 ID
   */
  async eraseTrafficCollection(userId: number, collectionId: number) {
    await this.trafficCollectionRepository.deleteTrafficCollection(
      collectionId,
      userId
    );
  }

  /**
   * 교통 컬렉션 이름 수정 함수
   * @param collectionUpdate 교통 컬렉션 수정 dto
   * @param userId
   */
  async modifyTrafficCollectionName(
    collectionNameUpdate: CollectionNameUpdate,
    userId: number
  ) {
    await this.trafficCollectionRepository.updateTrafficCollection(
      collectionNameUpdate,
      userId
    );
  }

  /**
   * 교통 컬렉션 상세정보 수정 함수
   * @param collectionUpdate 교통 컬렉션 수정 dto
   * @param userId 유저 아이디
   */
  async modifyTrafficCollectionDetail(
    collectionDetailUpdate: CollectionDetailUpdate,
    userId: number
  ) {
    const trafficCollection =
      await this.trafficCollectionRepository.findTrafficCollectionByCollectionIdAndUserId(
        collectionDetailUpdate.getCollectionId(),
        userId
      );
    await this.trafficCollectionDetailRepository.deleteTrafficCollectionDetailsByCollectionId(
      trafficCollection.getId()
    );
    await this.verifyUpdateTrafficCollectionStatus(
      collectionDetailUpdate,
      trafficCollection
    );
  }

  /**
   * 유저 아이디로 모든 교통 컬렉션 조회
   * @param userId 유저 아이디
   * @returns 유저의 모든 교통 컬렉션
   */
  async bringTrafficCollectionsByUserId(userId: number, currentTime: Date) {
    const collections =
      await this.trafficCollectionRepository.findTrafficCollectionsByUserId(
        userId
      );
    const currentHour = currentTime.getHours();
    collections.forEach((collection) => {
      const onlyGoToWork = collection.trafficCollectionDetails.every(
        (detail) => detail.getStatus() === "goToWork"
      );

      if (!onlyGoToWork) {
        collection.trafficCollectionDetails =
          collection.trafficCollectionDetails.filter((detail) => {
            if (currentHour >= 14 || currentHour < 2) {
              return detail.getStatus() === "goHome";
            } else {
              return detail.getStatus() === "goToWork";
            }
          });
      }
    });
    return collections;
  }

  /**
   * 특정 교통 컬렉션 조회
   * @param userId 유저 아이디
   * @param collectionId 교통 컬렉션 아이디
   * @returns 특정 교통 컬렉션 상세 정보
   */
  async bringTrafficCollectionDetailsById(
    userId: number,
    collectionId: number
  ) {
    return await this.trafficCollectionRepository.findTrafficCollectionDetailsById(
      userId,
      collectionId
    );
  }

  /**
   * 특정 교통 컬렉션 선택
   * @param userId 유저 아이디
   * @param collectionId 교통 컬렉션 아이디
   */
  async choiceTrafficCollection(userId: number, collectionId: number) {
    await this.trafficCollectionRepository.updateAllChoicesToFalse(userId);
    await this.trafficCollectionRepository.updateChoiceByCollectionId(
      userId,
      collectionId
    );
  }

  /**
   * 메인 화면 교통 컬렉션 조회 함수
   * @param userId 유저 아이디
   * @returns
   */
  async bringMainTrafficCollection(userId: number) {
    const currentHour = new Date().getHours();
    let status = currentHour >= 14 || currentHour < 2 ? "goHome" : "goToWork";
    let collection =
      await this.trafficCollectionRepository.findMainTrafficCollection(
        userId,
        status
      );
    // 만약 조회된 데이터가 없고 status가 'goHome'인 경우, 'goToWork' 데이터를 조회
    if (!collection && status === "goHome") {
      status = "goToWork";
      collection =
        await this.trafficCollectionRepository.findMainTrafficCollection(
          userId,
          status
        );
    }
    if (!collection) return false;
    const details = collection.trafficCollectionDetails.find(
      (transportationdetail) => transportationdetail.getStatus() === status
    );
    const departureTransportation = details.transportations.find(
      (transportation) => transportation.getRoute() === "departure"
    );
    const transportationNumbers =
      await this.transportationNumberRepository.findTransportationNumbers(
        departureTransportation.getId()
      );
    const numbers = transportationNumbers.map((transportationNumber) =>
      transportationNumber.getNumbers()
    );
    let result: StationResult;
    if (departureTransportation.getTransportationName() === "Subway") {
      try {
        const subwayArrivalInfo = await this.bringMainSubwayArrivalInfo(
          departureTransportation,
          numbers
        );
        result = StationResult.of(
          SubwayStationResult.of(subwayArrivalInfo),
          undefined,
          undefined
        );
      } catch (error) {
        if (
          error instanceof ErrorResponseDto &&
          error.getCode() === ErrorCode.NOT_FOUND_SUBWAY_ARRIVAL_INFO
        ) {
          result = StationResult.of(undefined, undefined, error.getMessage());
        }
      }
    } else if (departureTransportation.getTransportationName() === "Bus") {
      const busStations = await this.bringMainBusStationsInfo(
        departureTransportation,
        numbers
      );
      result = StationResult.of(
        undefined,
        BusStationResult.of(busStations),
        undefined
      );
    }
    return {
      collection,
      result,
    };
  }

  /**
   * 유저 아이디와 컬렉션 아이디, 컬렉션 상태를 조회해 반대 상태의 정보 조회
   * @param userId 유저 아이디
   * @param currentStatus 컬렉션의 상태(goToWokrt or goHome)
   * @returns
   */
  async changeTrafficRoute(
    userId: number,
    currentStatus: "goToWork" | "goHome"
  ) {
    const newStatus = currentStatus === "goToWork" ? "goHome" : "goToWork";
    const collection =
      await this.trafficCollectionRepository.findMainTrafficCollection(
        userId,
        newStatus
      );
    const details = collection.trafficCollectionDetails.find(
      (transportationdetail) => transportationdetail.getStatus() === newStatus
    );
    const departureTransportation = details.transportations.find(
      (transportation) => transportation.getRoute() === "departure"
    );
    const transportationNumbers =
      await this.transportationNumberRepository.findTransportationNumbers(
        departureTransportation.getId()
      );
    const numbers = transportationNumbers.map((transportationNumber) =>
      transportationNumber.getNumbers()
    );
    let result: StationResult;
    if (departureTransportation.getTransportationName() === "Subway") {
      try {
        const subwayArrivalInfo = await this.bringMainSubwayArrivalInfo(
          departureTransportation,
          numbers
        );
        result = StationResult.of(
          SubwayStationResult.of(subwayArrivalInfo),
          undefined,
          undefined
        );
      } catch (error) {
        if (
          error instanceof ErrorResponseDto &&
          error.getCode() === ErrorCode.NOT_FOUND_SUBWAY_ARRIVAL_INFO
        ) {
          result = StationResult.of(undefined, undefined, error.getMessage());
        }
      }
    } else if (departureTransportation.getTransportationName() === "Bus") {
      const busStations = await this.bringMainBusStationsInfo(
        departureTransportation,
        numbers
      );
      result = StationResult.of(
        undefined,
        BusStationResult.of(busStations),
        undefined
      );
    }
    return {
      collection,
      result,
    };
  }

  /**
   * 타입이 지하철일 때 사용자가 등록해놓은 출발역과 호선의 실시간 도착 정보 조회 함수
   * @param departureTransportation 출발 교통수단
   * @param numbers 지하철 호선 번호
   * @returns
   */
  private async bringMainSubwayArrivalInfo(
    departureTransportation: Transportation,
    numbers: string[]
  ): Promise<SubwayArrivalInfo[]> {
    const subwayArrivalInfo = await this.bringSubwayArrivalInfo(
      departureTransportation.getStationName(),
      numbers
    );
    return subwayArrivalInfo.map((info: SubwayArrivalInfo) =>
      SubwayArrivalInfo.of(info)
    );
  }

  /**
   * 타입이 버스일 때 사용자가 등록해놓은 출발역과 버스 번호들의 실시간 도착 정보 조회 함수
   * @param departureTransportation 출발 교통수단
   * @param numbers 버스 번호들
   * @returns
   */
  private async bringMainBusStationsInfo(
    departureTransportation: Transportation,
    numbers: string[]
  ): Promise<BusStationInfo[]> {
    const busStations = await this.busStationRepository.findByStationName(
      departureTransportation.getStationName()
    );
    return await Promise.all(
      busStations.map(async (station) => {
        const busArrivalInfo = await this.bringBusArrivalInfo(
          station.getStationNum(),
          numbers
        );
        return BusStationInfo.of(undefined, busArrivalInfo);
      })
    );
  }
  /**
   * 교통 컬렉션 등록 시 교통 컬렉션 상태 검증 함수
   * @param collectionInsert 컬렉션 등록 dto
   * @param trafficCollection 교통 컬렉션
   */
  public async verifyInsertTrafficCollectionStatus(
    collectionInsert: CollectionInsert,
    trafficCollection: TrafficCollection
  ) {
    if (collectionInsert.getGoToWork()) {
      await this.penetrateTrafficCollectionDetail(
        collectionInsert.getGoToWork(),
        trafficCollection
      );
    }
    if (collectionInsert.getGoHome()) {
      await this.penetrateTrafficCollectionDetail(
        collectionInsert.getGoHome(),
        trafficCollection
      );
    }
  }

  /**
   * 교통 컬렉션 수정 시 교통 컬렉션 상태 검증 함수
   * @param collectionInsert 컬렉션 등록 dto
   * @param trafficCollection 교통 컬렉션
   */
  public async verifyUpdateTrafficCollectionStatus(
    collectionDetailUpdate: CollectionDetailUpdate,
    trafficCollection: TrafficCollection
  ) {
    if (collectionDetailUpdate.getGoToWork()) {
      await this.penetrateTrafficCollectionDetail(
        collectionDetailUpdate.getGoToWork(),
        trafficCollection
      );
    }
    if (collectionDetailUpdate.getGoHome()) {
      await this.penetrateTrafficCollectionDetail(
        collectionDetailUpdate.getGoHome(),
        trafficCollection
      );
    }
  }

  /**
   * 역 이름을 이용하여 api 요청 후 받은 데이터 중 버스 호선과 number가 동일한 지하철 실시간 도착 데이터만 추출
   * @param stationName 역 이름
   * @param numbers 호선 번호
   * @returns
   */
  async bringSubwayArrivalInfo(stationName: string, numbers: string[]) {
    const arrivalList = await this.subwayApi.bringSubwayArrivalInfo(
      stationName
    );
    verifyarrivalList(arrivalList);
    return arrivalList
      .filter((info) => numbers.includes(info.subwayId))
      .map((info) => SubwayArrivalInfo.fromData(info))
      .filter((info): info is SubwayArrivalInfo => info !== null);
  }

  /**
   * 정류소 고유번호를 이용하여 api 요청 후 받은 데이터 중 버스 번호가 numbers와 동일한 버스 실시간 도착 데이터만 추출
   * @param stationNum 정류소 고유번호
   * @param numbers 버스 번호들
   * @returns
   */
  async bringBusArrivalInfo(stationNum: number, numbers: string[]) {
    const busArrivalList = await this.busApi.bringBusArrivalInfo(stationNum);
    return busArrivalList
      .filter((item) => numbers.includes(item.busRouteAbrv))
      .map((item) => BusArrivalInfo.fromData(item));
  }
}
