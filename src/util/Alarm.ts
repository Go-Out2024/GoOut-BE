import { Service } from "typedi";
import { TrafficService } from "../service/Traffic.Service.js";


@Service()
export class Alarm{

   

    constructor(private readonly trafficService:TrafficService){}



    public async handleAlarm(datas:any[]){
        // 정보를 조회
        return datas.map(async (data:any)=>{
            return this.trafficService.bringMainTrafficCollection(data.user_id) ;
        }); 
        // 정보 중 지하철은 10분전, 버스는 5전역 전이라면 데이터를 필터링


        // 필터링 된 데이터 중 유저의 파이어베이스 토큰을 보내 알림을 보냄
    }

    // public async distinguishTransportation(data:any){

    //     switch(data){
    //         case data.transportation_name === 'Subway':
    //             this.getSubwayInfo(data.station_name)
    //     }

    // }

    // public getBusInfo(stationName:string){

    //     return this.trafficSearchService.bringSubwayArrivalInfo(stationName);
    // }


    // public getSubwayInfo(stationName:string){
    //     return this.trafficSearchService.bringSubwayArrivalInfo(stationName);
    // }


}