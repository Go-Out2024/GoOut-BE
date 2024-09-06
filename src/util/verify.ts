

import { Calendar } from "../entity/Calendar";
import { User } from "../entity/User";
import { ErrorCode } from "../exception/ErrorCode";
import { ErrorResponseDto } from "../response/ErrorResponseDto";
import { checkData } from "./checker";




export const verifyUser = async(user:User)=> {
    if (!checkData(user)) {
        throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_USER);
    }
}



/**
 * 카테고리 검증 함수
 * @param data 확인할 데이터
 */
export const verifyEateryCategory= async(data:string)=>{
    if(!checkData(data)){
        throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_EATERY_CATEGORY);
    }
}



/**
 * 캘린더 데이터 검증 함수
 * @param calendar 검증할 캘린더 엔티티 데이터
 */
export const verifyCalendar = async(calendar:Calendar)=>{
    if(!checkData(calendar))
        throw ErrorResponseDto.of(ErrorCode.NOT_FOUNT_CALENDAR);
}


/**
 * 캘린더 데이터와 유저가 요청한 length를 통해 길이가 같지 않을 경우 에러처리를 한다.
 * @param calendars 캘린더 엔티티 데이터
 * @param length 유저 요청 길이
 */
export const  verifyCalendars = async(calendars:Calendar[], length:number)=>{
    if(!(calendars.length === length))
        throw ErrorResponseDto.of(ErrorCode.NOT_FOUNT_CALENDAR);
}