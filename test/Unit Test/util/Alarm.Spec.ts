import {Alarm} from '../../../src/util/Alarm';
import {TrafficService} from '../../../src/service/Traffic.Service';
import { pushNotice } from '../../../src/util/firebaseMessage';
import { TrafficCollection } from '../../../src/entity/TrafficCollection';
import { BusStationResult, StationResult, SubwayStationResult } from '../../../src/dto/values/StationResult';


jest.mock('../../../src/service/Traffic.Service')
jest.mock('../../../src/util/firebaseMessage');


describe('Alarm Util Test', ()=>{

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    let alarm : Alarm;
    const trafficService = new TrafficService({} as any,{} as any,{} as any,{} as any,{} as any,{} as any,{} as any,{} as any) as jest.Mocked<TrafficService>

    beforeEach(async () => {
        alarm = new Alarm(trafficService);
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });

    describe('handleAlarm function test', ()=>{

        it('basic', async ()=>{
            const transportationData = {
                collection: {} as TrafficCollection,
                result: {} as  StationResult
            };
            const arrivalDatas = ['10분 후 도착'];

            const datas = [{token:'token1', user_id: 1},{token:'token2', user_id: 2} ]
            trafficService.bringMainTrafficCollection.mockResolvedValue(transportationData);
            const arrivalDatasSpy = jest.spyOn(alarm as any, 'extractTransportationArrivalInfo').mockReturnValue(arrivalDatas);
            const flagSpy = jest.spyOn(alarm as any, 'checkTransportationTime').mockReturnValue(true);
            const sendPushAlarmSpy = jest.spyOn(alarm as any, 'sendPushAlarm');

            await alarm.handleAlarm(datas);

            expect(trafficService.bringMainTrafficCollection).toHaveBeenCalledWith(datas[0].user_id);
            expect(arrivalDatasSpy).toHaveBeenCalledWith(transportationData.result);
            expect(flagSpy).toHaveBeenCalledWith(arrivalDatas);
            expect(sendPushAlarmSpy).toHaveBeenCalledWith(datas[0].token, true);
        });
    });

    describe('sendPushAlarm function test', ()=>{
        const flag = true;
        it('basic', async ()=>{

            await alarm['sendPushAlarm']('engineValue', flag);
            expect(pushNotice).toHaveBeenCalledWith('engineValue', "교통수단 알림", "등록하신 교통수단의 도착 시간이 10분 전입니다.")
        });
    });


    describe('checkTransportationTime function test', ()=>{
        const time =  ['10분 후 도착'];
        it('basic', ()=>{
            const result = alarm['checkTransportationTime'](time);
            expect(result).toEqual(true)
        });
    });

    describe('checkTransportationTime function test', ()=>{

        it('getBusStations undefined', ()=>{
            const stationResult = {
                getSubwayStation: jest.fn().mockReturnValue({
                    getSubwayArrivalInfo: jest.fn().mockReturnValue(['result1', 'result2']),
                }),
                getBusStations: jest.fn().mockReturnValue(undefined),
            } as unknown as StationResult;
            const extractSubwayArrivalInfoSpy = jest.spyOn(alarm as any, 'extractSubwayArrivalInfo').mockReturnValue(['result1', 'result2']);
            const result = alarm['extractTransportationArrivalInfo'](stationResult);
            expect(result).toEqual(['result1', 'result2']);
            expect(extractSubwayArrivalInfoSpy).toHaveBeenCalledWith(stationResult.getSubwayStation());
        });

        it('getBusStations undefined', ()=>{
            const stationResult = {
                getSubwayStation: jest.fn().mockReturnValue(undefined),
                getBusStations: jest.fn().mockReturnValue({
                    getBusArrivalInfo: jest.fn().mockReturnValue(['result1', 'result2']),
                }),
            } as unknown as StationResult;
            const extractSubwayArrivalInfoSpy = jest.spyOn(alarm as any, 'extractBusArrivalInfo').mockReturnValue(['result1', 'result2']);
            const result = alarm['extractTransportationArrivalInfo'](stationResult);
            expect(result).toEqual(['result1', 'result2']);
            expect(extractSubwayArrivalInfoSpy).toHaveBeenCalledWith(stationResult.getBusStations());
        });

        it('all undefined', ()=>{
            const stationResult = {
                getSubwayStation: jest.fn().mockReturnValue(undefined),
                getBusStations: jest.fn().mockReturnValue(undefined),
            } as unknown as StationResult;
          
            const result = alarm['extractTransportationArrivalInfo'](stationResult);
            expect(result).toBeUndefined()
        });
    });


    describe('extractSubwayArrivalInfo function test', ()=>{
 
        it('basic', ()=>{
            const subwayStationMock = {
                getSubwayArrivalInfo: jest.fn().mockReturnValue([
                    { getFirstArrivalMessage: jest.fn().mockReturnValue('5번째 도착') },
                    { getFirstArrivalMessage: jest.fn().mockReturnValue('10분 후 도착') },
                ]),
            } as unknown as SubwayStationResult;
            const result = alarm['extractSubwayArrivalInfo'](subwayStationMock);
            expect(result).toEqual(['5번째 도착', '10분 후 도착']);
            expect(subwayStationMock.getSubwayArrivalInfo).toHaveBeenCalled();
        });
    });

    describe('extractBusArrivalInfo function test', ()=>{
 
        it('basic', ()=>{
            const busStationMock = {
                getBusStationsInfo: jest.fn().mockReturnValue([
                    {
                        getBusArrivalInfo: jest.fn().mockReturnValue([
                            { getArrmsg1: jest.fn().mockReturnValue('버스 1 도착') },
                            { getArrmsg1: jest.fn().mockReturnValue('버스 2 도착') },
                        ]),
                    },
                    {
                        getBusArrivalInfo: jest.fn().mockReturnValue([
                            { getArrmsg1: jest.fn().mockReturnValue('버스 3 도착') },
                        ]),
                    },
                ]),
            } as unknown as BusStationResult;
            const result = alarm['extractBusArrivalInfo'](busStationMock);

            expect(result).toEqual(['버스 1 도착', '버스 2 도착', '버스 3 도착']);
            expect(busStationMock.getBusStationsInfo).toHaveBeenCalled();
        });
    });
});