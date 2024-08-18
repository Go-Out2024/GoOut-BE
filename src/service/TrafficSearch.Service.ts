import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { SubwayStationRepository } from "../repository/SubwayStation.Repository.js";
import { BusStationRepository } from "../repository/BusStation.Repository.js";
import { checkData } from "../util/checker.js";
import { ErrorResponseDto } from "../response/ErrorResponseDto.js";
import { ErrorCode } from "../exception/ErrorCode.js";
import { BusRepository } from "../repository/Bus.Repository.js";
import { envs } from "../config/environment.js";
import axios from 'axios';
import xml2js from 'xml2js';

@Service()
export class TrafficSearchService {

    constructor(
        @InjectRepository(SubwayStationRepository) private subwayStationRepository: SubwayStationRepository,
        @InjectRepository(BusStationRepository) private busStationRepository: BusStationRepository,
        @InjectRepository(BusRepository) private busRepository: BusRepository,
    ) {}
    /**
     * 역 또는 정류장 이름으로 해당 역 또는 정류장 도착정보 조회 함수
     * @param stationName 역 또는 정류장 이름
     */
    // 역 또는 정류장 이름으로 해당 역 또는 정류장 도착정보 조회 함수
    async bringStationInformation(stationName: string) {
        let result: any = {};
        if (stationName.endsWith('역')) {
            const subwayName = stationName.slice(0, -1); // '역' 제거
            const subwayStation = await this.subwayStationRepository.findByStationName(subwayName);
            if (subwayStation) {
                const subwayArrivalInfo = await this.bringSubwayArrivalInfo(subwayName);
                result.subwayArrivalInfo = subwayArrivalInfo;
            }
            const busStations = await this.busStationRepository.findByStationName(stationName);
            if (busStations.length > 0) {
                result.busStations = await Promise.all(
                    busStations.map(async (station) => {
                        // 새로운 API를 사용해 stationNum으로 버스 도착 정보를 조회
                        const busArrivalInfo = await this.bringBusArrivalInfo(station.stationNum);
                        return {
                            station: {
                                id: station.id,
                                stationName: station.stationName,
                            },
                            busArrivalInfo,
                        };
                    })
                );
            }
            if (!subwayStation && !result.busStations) {
                throw new Error('해당 지하철 역 및 버스 정류장이 존재하지 않습니다.');
            }
        } else {
            const busStations = await this.busStationRepository.findByStationName(stationName);
            if (busStations.length === 0) {
                throw new Error('해당 버스 정류장이 존재하지 않습니다.');
            }
            result.busStations = await Promise.all(
                busStations.map(async (station) => {
                    // 새로운 API를 사용해 stationNum으로 버스 도착 정보를 조회
                    const busArrivalInfo = await this.bringBusArrivalInfo(station.stationNum);
                    return {
                        station: {
                            id: station.id,
                            stationName: station.stationName,
                        },
                        busArrivalInfo,
                    };
                })
            );
        }
        return result;
    }
    /**
     * 지하철 역 이름으로 해당 역 도착 정보 조회 
     * @param subwayName 지하철 역 이름
     * @returns 
     */
    async bringSubwayStationInfo(subwayName: string) {
        return await this.bringSubwayArrivalInfo(subwayName);
    }
    /**
     * 버스 정류장 아이디로 버스 정류장 고유번호 조회 후 api 요청 함수
     * @param stationName 버스 정류장 이름
     * @param busStationId 버스 정류장 아이디
     * @returns 
     */
    async bringBusStationInfo(stationName: string, busStationId: number) {
        const stationNum = await this.busStationRepository.findStationNumByStationId(busStationId);       
        const busArrivalInfo = await this.bringBusArrivalInfo(stationNum);
        return { stationName, busStationId, busArrivalInfo};
    }
    /**
     * 사용자가 입력 단어로 연관 역 또는 정류장 이름 조회 함수
     * @param searchTerm 입력 단어
     * @returns 
     */
    async bringStationRelatedSearch(searchTerm: string) {
        const subwayResults = await this.subwayStationRepository.findSubwayStations(searchTerm);
        const busStationResults = await this.busStationRepository.findBusStations(searchTerm);
        const result = [];

        if(subwayResults.length > 0) {
            result.push(
                ...subwayResults.map(station => ({
                    name: station.subwayName,
                    type: '지하철'
                }))
            );
        }

        if (busStationResults.length> 0) {
            result.push(
                ...busStationResults.map(station => ({
                    name: station.stationName,
                    id: station.id,
                    type: '버스'
                }))
            );
        }
        return result;
    }   

    private subwayApiKey: string = envs.apikey.subwayapikey;
    private busApiKey: string = envs.apikey.busapikey;
    /**
     * 지하철 역 이름으로 해당 역에 대한 역 이름, 역 호선, 방면, 첫번 째 두 번째 도착 예정 열차 정보, 목적지 조회 함수
     * @param stationName 지하철 역 이름
     * @returns 
     */
    private async bringSubwayArrivalInfo(stationName: string) {
        const subwayApiUrl = `http://swopenAPI.seoul.go.kr/api/subway/${this.subwayApiKey}/json/realtimeStationArrival/0/5/${encodeURIComponent(stationName)}`;
        try {
            const response = await axios.get(subwayApiUrl);
            const data = response.data;

            if (data.RESULT && data.RESULT.code !== 'INFO-000') {
                throw new Error(`Error from API: ${data.RESULT.message}`);
            }
            const arrivalInfo = data.realtimeArrivalList.map((info: any) => ({
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
     * 버스 정류장 고유번호를 이용한 api 요청 후 데이터 추출 함수
     * @param stationNum 정류장 고유번호
     * @returns 
     */
    private async bringBusArrivalInfo(stationNum: number) {
        // stationNum이 4자리라면 앞에 '0'을 붙여 5자리로 변환합니다.
        const formattedStationNum = stationNum.toString().padStart(5, '0');
        const busApiUrl = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid?serviceKey=${this.busApiKey}&arsId=${formattedStationNum}`;
        try {
            const response = await axios.get(busApiUrl);
            const data = response.data;
            // XML 데이터를 JSON으로 파싱
            const parsedData = await xml2js.parseStringPromise(data, { explicitArray: false });
            // 필요한 데이터 추출
            const itemList = parsedData.ServiceResult.msgBody.itemList;
            if (!itemList) {
                throw new Error('도착 예정 정보를 찾을 수 없습니다.');
            }
            // itemList가 배열일 경우 다수의 버스 정보를 반환
            if (Array.isArray(itemList)) {
                return itemList.map(item => ({
                    nxtStn: item.nxtStn || '정보 없음', 
                    busRouteAbrv: item.busRouteAbrv || '정보 없음',
                    arrmsg1: item.arrmsg1 || '정보 없음',
                    arrmsg2: item.arrmsg2 || '정보 없음'
                }));
            } else {
                // 단일 객체일 경우
                return [{
                    nxtStn: itemList.nxtStn || '정보 없음',
                    busRouteAbrv: itemList.busRouteAbrv || '정보 없음',
                    arrmsg1: itemList.arrmsg1 || '정보 없음',
                    arrmsg2: itemList.arrmsg2 || '정보 없음'
                }];
            }
        } catch (error) {
            console.error('버스 도착 예정 정보 요청 오류:', error);
            return [{
                busRouteAbrv: '정보 없음',
                arrmsg1: '정보 없음',
                arrmsg2: '정보 없음'
            }];
        }
    }
}
