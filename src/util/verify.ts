

import { CollectionInsert } from "../dto/request/CollectionInsert";
import { Calendar } from "../entity/Calendar";
import { TrafficCollection } from "../entity/TrafficCollection";
import { User } from "../entity/User";
import { ErrorCode } from "../exception/ErrorCode";
import { ErrorResponseDto } from "../response/ErrorResponseDto";
import { checkData } from "./checker";




export const verifyUser = (user:User)=> {
    if (!checkData(user)) {
        throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_USER);
    }
}



/**
 * 카테고리 검증 함수
 * @param data 확인할 데이터
 */
export const verifyEateryCategory= (data:string)=>{
    if(!checkData(data)){
        throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_EATERY_CATEGORY);
    }
}



/**
 * 캘린더 데이터 검증 함수
 * @param calendar 검증할 캘린더 엔티티 데이터
 */
export const verifyCalendar = (calendar:Calendar)=>{
    if(!checkData(calendar))
        throw ErrorResponseDto.of(ErrorCode.NOT_FOUNT_CALENDAR);
}


/**
 * 캘린더 데이터와 유저가 요청한 length를 통해 길이가 같지 않을 경우 에러처리를 한다.
 * @param calendars 캘린더 엔티티 데이터
 * @param length 유저 요청 길이
 */
export const  verifyCalendars = (calendars:Calendar[], length:number)=>{
    if(!(calendars.length === length))
        throw ErrorResponseDto.of(ErrorCode.NOT_FOUNT_CALENDAR);
}

/**
* 검색 역의 열차정보가 없을 때 예외처리 함수
* @param arrivalList 열차정보
*/
export const verifyarrivalList= (arrivalList: any)=>{
    if (!checkData(arrivalList)) {
        throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_SUBWAY_ARRIVAL_INFO);
    }
}

/**
* 존재하지 않을 역 이름 요청했을 때 예외 처리 함수
* @param coordinates 
*/
export const verifyCoordinates= (coordinates: any)=>{
    if (!checkData(coordinates)) {
        throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_STATION_NAME);
    }
}
