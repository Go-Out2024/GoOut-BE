import axios from 'axios';
import { envs } from '../config/environment';
import { Service } from "typedi";
import xml2js from 'xml2js'

@Service()
export class SubwayApi {
    private readonly subwayApiKey = envs.apikey.subwayapikey;
    private readonly BASE_URL = "http://swopenAPI.seoul.go.kr/api/subway";

    // 지하철 도착 정보를 가져오는 메서드
    async bringSubwayArrivalInfo(stationName: string) {
        const url = `${this.BASE_URL}/${this.subwayApiKey}/json/realtimeStationArrival/0/99/${encodeURIComponent(stationName)}`;
        try {
            const response = await axios.get(url);
            const data = response.data;

            if (data.RESULT && data.RESULT.code !== 'INFO-000') {
                throw new Error(`Error from API: ${data.RESULT.message}`);
            }
            return data.realtimeArrivalList; // 필터링은 호출하는 서비스 함수에서 수행
        } catch (error) {
        //    console.error('Failed to fetch subway arrival info:', error.message);
            throw new Error('지하철 실시간 도착 정보를 가져오는 중 오류가 발생했습니다.');
        }
    }
}

@Service()
export class BusApi {
    private readonly busApiKey = envs.apikey.busapikey;
    private readonly BASE_URL = "http://ws.bus.go.kr/api/rest/stationinfo";

    async bringBusArrivalInfo(stationNum: number) {
        const formattedStationNum = stationNum.toString().padStart(5, '0');
        const url = `${this.BASE_URL}/getStationByUid?serviceKey=${this.busApiKey}&arsId=${formattedStationNum}`;
        try {
            const response = await axios.get(url);
            const data = response.data;

            const parsedData = await xml2js.parseStringPromise(data, { explicitArray: false });
            const itemList = parsedData.ServiceResult.msgBody.itemList;

            if (!itemList) {
                throw new Error('Item list not found in response');
            }

            return Array.isArray(itemList) ? itemList : [itemList]; 
        } catch (error) {
          //  console.error('버스 도착 예정 정보 요청 오류:', error);
            throw new Error('버스 실시간 도착 정보를 가져오는 중 오류가 발생했습니다.');
        }
    }
}