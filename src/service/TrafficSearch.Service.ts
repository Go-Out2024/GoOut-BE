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
    async bringStationInformation(stationName: string) {
        let result: any = {};
        if (stationName.endsWith('역')) {
            //'역'으로 끝나는 경우
            const subwayName = stationName.slice(0, -1); // '역' 뺴고 조회 -> DB에 그렇게 저장되어 있기 때문에
            const subwayStation = await this.subwayStationRepository.findByStationName(subwayName);
            if (subwayStation) {
                const subwayArrivalInfo = await this.bringSubwayArrivalInfo(subwayName);
                result.subwayArrivalInfo = subwayArrivalInfo;
            }
            //'역'을 포함해 버스 정류장 조회
            const busStations = await this.busStationRepository.findByStationName(stationName);
            if (busStations.length > 0) {
                result.busStations = await Promise.all(
                    busStations.map(async (station) => {
                        const buses = await this.busRepository.findByStationId(station.id);
                        const busArrivalInfo = await Promise.all(
                            buses.map(async (bus) => {
                                // bus 객체에서 올바른 속성명을 사용하여 API 호출
                                const busRouteId = bus.bus_bus_id;  
                                const ord = bus.bus_sequence;       
                                if (busRouteId === undefined || ord === undefined) {
                                    console.error('버스 아이디 또는 순번이 존재하지 않습니다.', { busRouteId, ord });
                                    return null;  // 또는 적절한 기본값 반환
                                }
                                return this.bringBusArrivalInfo(station.id, busRouteId, ord);
                            })
                        );
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
        }
        else {
            //'역'이 아닌 경우, 버스 정류장만 조회
            const busStations = await this.busStationRepository.findByStationName(stationName);
            if (busStations.length === 0) {
                throw new Error('해당 버스 정류장이 존재하지 않습니다.');
            }
            result.busStations = await Promise.all(
                busStations.map(async (station) => {
                    const buses = await this.busRepository.findByStationId(station.id);
                    const busArrivalInfo = await Promise.all(
                        buses.map(async (bus) => {
                            // bus 객체에서 올바른 속성명을 사용하여 API 호출
                            const busRouteId = bus.bus_bus_id;  
                            const ord = bus.bus_sequence;       
                            if (busRouteId === undefined || ord === undefined) {
                                console.error('버스 아이디 또는 순번이 존재하지 않습니다.', { busRouteId, ord });
                                return null;  // 또는 적절한 기본값 반환
                            }
                            return this.bringBusArrivalInfo(station.id, busRouteId, ord);
                        })
                    );
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
     * 버스 정류장 아이디, 버스 노선 아이디, 버스 순번으로 해당 정류장을 지나는 모든 버스에 대한 이름과 두 번째 도착 정보까지 조회
     * @param stId 버스 정류장 아이디
     * @param busRouteId 버스 노선 아이디
     * @param ord 버스 순번
     * @returns 
     */
    private async bringBusArrivalInfo(stId: number, busRouteId: number, ord: number){
        const busApiUrl = `http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRoute?serviceKey=${this.busApiKey}&stId=${stId}&busRouteId=${busRouteId}&ord=${ord}`;
        console.log(busApiUrl);
        try {
            const response = await axios.get(busApiUrl);
            const data = response.data;
    
            // XML 데이터를 JSON으로 파싱
            const parsedData = await xml2js.parseStringPromise(data, { explicitArray: false });
            
            // 데이터 구조 확인
            console.log('Parsed XML Data:', parsedData);

            // 필요한 데이터 추출
            const itemList = parsedData.ServiceResult.msgBody.itemList;
            if (!itemList) {
                throw new Error('Item list not found in response');
            }

            return {
                busRouteAbrv: itemList.busRouteAbrv || '정보 없음',
                arrmsg1: itemList.arrmsg1 || '정보 없음',
                arrmsg2: itemList.arrmsg2 || '정보 없음'
            };
        }  catch (error) {
            console.error('버스 도착 예정 정보 요청 오류:', error);
            return {
                busRouteAbrv: '정보 없음',
                arrmsg1: '정보 없음',
                arrmsg2: '정보 없음'
            };
        }
    }
}
