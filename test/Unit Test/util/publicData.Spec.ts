import {SubwayApi, BusApi} from '../../../src/util/publicData';
import { envs } from '../../../src/config/environment';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

jest.mock('axios');
jest.mock('xml2js', () =>({
    parseStringPromise:jest.fn()
}))




describe('publicData (SubwayApi, BusApi) Util Test', () => {

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    let subwayApi:SubwayApi;
    let busApi:BusApi;


    beforeEach(async () => {
        subwayApi = new SubwayApi() as jest.Mocked<SubwayApi>;
        busApi = new BusApi() as jest.Mocked<BusApi>;
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });
    
    
    describe('bringSubwayArrivalInfo function test', () => {
        const subwayApiKey = envs.apikey.subwayapikey;
        const BASE_URL = "http://swopenAPI.seoul.go.kr/api/subway";
        const stationName = 'bus-station'
        const url = `${BASE_URL}/${subwayApiKey}/json/realtimeStationArrival/0/99/${encodeURIComponent(stationName)}`;
        it('basic', async () => {
            const mockResponse = {
                data: {
                    realtimeArrivalList: [
                        { train: '1호선', destination: '서울역' },
                        { train: '2호선', destination: '강남역' }
                    ],
                    RESULT: { code: 'INFO-000' }
                }
            };
            (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);
            const result = await subwayApi.bringSubwayArrivalInfo(stationName);
            expect(result).toEqual(mockResponse.data.realtimeArrivalList);
            expect(axios.get).toHaveBeenCalledWith(url)

        });

        it('data.RESULT.code is not INFO-000', async () => {
            const mockResponse = {
                data: {
                    realtimeArrivalList: [
                        { train: '1호선', destination: '서울역' },
                        { train: '2호선', destination: '강남역' }
                    ],
                    RESULT: { code: 'INFO-001', message:'Invalid request' }
                }
            };
            (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);
            await expect(subwayApi.bringSubwayArrivalInfo('서울역')).rejects.toThrow(
                 "지하철 실시간 도착 정보를 가져오는 중 오류가 발생했습니다."
            );
        });
    });


    describe('bringSubwayArrivalInfo function test', () => {
        const busApiKey = envs.apikey.busapikey;
        const BASE_URL = "http://ws.bus.go.kr/api/rest/stationinfo";
        const stationNum = 134324;
        const formattedStationNum = stationNum.toString().padStart(5, '0');
        const url = `${BASE_URL}/getStationByUid?serviceKey=${busApiKey}&arsId=${formattedStationNum}`;
        it('itemList array', async () => {
            const mockXmlData = '<ServiceResult><msgBody><itemList><bus>Bus1</bus><bus>Bus2</bus></itemList></msgBody></ServiceResult>';
            const mockParsedData = {
                ServiceResult: {
                    msgBody: {
                        itemList: [
                            { bus: 'Bus1' },
                            { bus: 'Bus2' }
                        ]
                    }
                }
            };
            (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockXmlData });
            (parseStringPromise as jest.Mock).mockResolvedValueOnce(mockParsedData);
            const result = await busApi.bringBusArrivalInfo(stationNum);
            expect(result).toEqual(mockParsedData.ServiceResult.msgBody.itemList);
            expect(axios.get).toHaveBeenCalledWith(url);
        });

        it('itemList is not array', async () => {
            const mockXmlData = '<ServiceResult><msgBody><itemList><bus>Bus1</bus><bus>Bus2</bus></itemList></msgBody></ServiceResult>';
            const mockParsedData = {
                ServiceResult: {
                    msgBody: {
                        itemList:  { bus: 'Bus1' }     
                    }
                }
            };
            (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockXmlData });
            (parseStringPromise as jest.Mock).mockResolvedValueOnce(mockParsedData);
            const result = await busApi.bringBusArrivalInfo(stationNum);
            expect(result).toEqual([mockParsedData.ServiceResult.msgBody.itemList]);
            expect(axios.get).toHaveBeenCalledWith(url);
        });
        
        it('itemList is not', async () => {
            const mockXmlData = '<ServiceResult><msgBody></msgBody></ServiceResult>';
            const mockParsedData = {
                ServiceResult: {
                    msgBody: {}
                }
            };
            (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockXmlData });
            (parseStringPromise as jest.Mock).mockResolvedValueOnce(mockParsedData);
            await expect(busApi.bringBusArrivalInfo(stationNum)).rejects.toThrow(
               '버스 실시간 도착 정보를 가져오는 중 오류가 발생했습니다.'
            );
        });
    });
});
