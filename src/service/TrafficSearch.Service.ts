import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { SubwayStationRepository } from "../repository/SubwayStation.Repository";
import { BusStationRepository } from "../repository/BusStation.Repository";
import { BusRepository } from "../repository/Bus.Repository";
import { StationResult, SubwayStationResult, BusStationResult } from "../dto/values/StationResult"
import { SubwayArrivalInfo } from "../dto/values/SubwayArrivalInfo";
import { BusStationInfo, BusArrivalInfo } from "../dto/values/BusArrivalInfo";
import { Station } from "../dto/values/BusArrivalInfo";
import { BusStation } from "../entity/BusStation";
import { SubwayApi } from "../util/publicData";
import { BusApi } from "../util/publicData";
import { checkData } from "../util/checker";
import { ErrorResponseDto } from "../response/ErrorResponseDto";
import { ErrorCode } from "../exception/ErrorCode";
import { verifyarrivalList } from "../util/verify";

@Service()
export class TrafficSearchService {

    constructor(
        @InjectRepository(SubwayStationRepository) private subwayStationRepository: SubwayStationRepository,
        @InjectRepository(BusStationRepository) private busStationRepository: BusStationRepository,
        private subwayApi: SubwayApi,
        private busApi: BusApi
    ) {}

    /**
     * 역 이름을 조회하여 존재할 경우 해당 역 실시간 도착 정보 조회 함수
     * @param stationName 역 이름
     * @returns 
     */
    async bringStationInformation(stationName: string): Promise<StationResult> {
        if (this.checkStationName(stationName)) {
            return await this.handleSubwayOrBusStation(stationName);
        } else {
            return await this.handleBusStation(stationName);
        }
    }

    /**
     * 사용자 검색이 '역'으로 끝나는지 확인 함수
     * @param stationName 역 이름
     * @returns 
     */
    private checkStationName(stationName: string): boolean {
        return stationName.endsWith('역');
    }

    /**
     * '역'으로 끝나는 역 또는 정류장 테이블 조회 후 존재 시 실시간 도착 정보 조회 함수
     * @param stationName 역 이름
     * @returns 
     */
    private async handleSubwayOrBusStation(stationName: string): Promise<StationResult> {
        const subwayName = this.removeStationSuffix(stationName);
        const subwayStation = await this.subwayStationRepository.findByStationName(subwayName);
        let subwayStationResult: SubwayStationResult | undefined;
        let busStationResult: BusStationResult | undefined;
        let subwayErrorMessage: string | undefined;

        // 지하철 정보 조회 시 발생하는 에러를 잡아내기 위해 try-catch 사용
        if (subwayStation) {
            try {
                const subwayArrivalInfo = await this.bringSubwayArrivalInfo(subwayName);
                subwayStationResult = SubwayStationResult.of(subwayArrivalInfo);
            } catch (error) {
                if (error instanceof ErrorResponseDto && error.getCode() === ErrorCode.NOT_FOUND_SUBWAY_ARRIVAL_INFO) {
                    subwayErrorMessage = error.getMessage();
                } else {
                    throw error; // 다른 에러는 그대로 던짐
                }
            }
        }
        const busStations = await this.busStationRepository.findByStationName(stationName);
        if (busStations.length > 0) {
            const busStationsInfo = await this.bringBusStationsInfo(busStations);
            busStationResult = BusStationResult.of(busStationsInfo);
        }
        if (!subwayStationResult && !busStationResult) {
            throw new Error('해당 지하철 역 및 버스 정류장이 존재하지 않습니다.');
        }
        return StationResult.of(subwayStationResult, busStationResult, subwayErrorMessage);
    }
    
    /**
     * 역 이름으로 버스 정류장 조회 후 존재 시 실시간 도착 정보 조회 함수
     * @param stationName 역 이름
     * @returns 
     */
    private async handleBusStation(stationName: string): Promise<StationResult> {
        const busStations = await this.busStationRepository.findByStationName(stationName);
        if (busStations.length === 0) {
            throw new Error('해당 버스 정류장이 존재하지 않습니다.');
        }
        const busStationsInfo = await this.bringBusStationsInfo(busStations);
        const busStationResult = BusStationResult.of(busStationsInfo);
        return StationResult.of(undefined, busStationResult, undefined);
    }
    
    /**
     * 지하철 open api요청은 '역'을 빼고 요청해야 함으로 '역'제거 함수
     * @param stationName 역 이름
     * @returns 
     */
    private removeStationSuffix(stationName: string): string {
        return stationName.slice(0, -1); // '역' 제거
    }
    
    /**
     * 조회된 버스 정류장으로 해당 버스 정류장마다 지나가는 버스 조회 함수
     * @param busStations 버스 정류장
     * @returns 
     */
    private async bringBusStationsInfo(busStations: BusStation[]): Promise<BusStationInfo[]> {
        return await Promise.all(
            busStations.map(async (station) => {
                const busArrivalInfo = await this.bringBusArrivalInfo(station.getStationNum());
                const stationDto = new Station(station.getId(), station.getStationName());
                return BusStationInfo.of(stationDto, busArrivalInfo);
            })
        );
    }
    
    /**
     * 연관 검색어를 이용해 사용자가 지하철 역 선택 시 지하철 역 이름으로 해당 역 정보 제공 함수
     * @param subwayName 지하철 역 이름
     * @returns 
     */
    async bringSubwayStationInfo(subwayName: string): Promise<SubwayArrivalInfo[]> {
        return await this.bringSubwayArrivalInfo(subwayName);
    }

    /**
     * 연관 검색어를 이용해 사용자가 버스 정류장 선텍 시 버스 정류장 이름과 아이디로 해당 정류장 정보 제공 함수
     * @param stationName 정류장 이름
     * @param busStationId 버스 정류장 아이디
     * @returns 
     */
    async bringBusStationInfo(stationName: string, busStationId: number): Promise<BusStationInfo> {
        const stationNum = await this.busStationRepository.findStationNumByStationId(busStationId);       
        const busArrivalInfo = await this.bringBusArrivalInfo(stationNum);
        const stationDto = new Station(busStationId, stationName);
        return BusStationInfo.of(stationDto, busArrivalInfo);
    }

    /**
     * 단어 단위로 입력 시 연관 검색어 조회 함수
     * @param searchTerm 입력 단어
     * @returns 
     */
    async bringStationRelatedSearch(searchTerm: string) {
        const subwayResults = await this.subwayStationRepository.findSubwayStations(searchTerm);
        const busStationResults = await this.busStationRepository.findBusStations(searchTerm);
        const result = [];

        if (subwayResults.length > 0) {
            result.push(
                ...subwayResults.map(station => ({
                    name: station.getSubwayName(),
                    type: '지하철'
                }))
            );
        }

        if (busStationResults.length > 0) {
            result.push(
                ...busStationResults.map(station => ({
                    name: station.getStationName(),
                    id: station.getId(),
                    type: '버스'
                }))
            );
        }
        return result;
    }   
    
    /**
     * 지하철 역 이름으로 지하철 실시간 도착 정보 요청 및 데이터 추출 함수
     * @param stationName 지하철 역 이름
     * @returns 
     */
    private async bringSubwayArrivalInfo(stationName: string): Promise<SubwayArrivalInfo[]> {
        const arrivalList = await this.subwayApi.bringSubwayArrivalInfo(stationName);
        verifyarrivalList(arrivalList);
        return arrivalList
            .map(info => SubwayArrivalInfo.fromData(info));
    }

    /**
     * 정류소 고유번호를 이용해 버스 정류장 실시간 도착 정보 요청 및 데이터 추출 함수
     * @param stationNum 정류소 고유번호
     * @returns 
     */
    async bringBusArrivalInfo(stationNum: number): Promise<BusArrivalInfo[]> {
        const busArrivalList = await this.busApi.bringBusArrivalInfo(stationNum);
        return busArrivalList
            .map(item => BusArrivalInfo.fromData(item));
    }
}
