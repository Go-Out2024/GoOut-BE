

export enum ErrorCode  {
    
    ERROR = 501,
    NO_VALUE=502,
    NOT_FOUND_EATERY_CATEGORY=400,
    NOT_FOUND_STATION_NAME=402,
    NOT_FOUNT_CALENDAR=401,
    NOT_FOUND_SUBWAY_ARRIVAL_INFO=403,
    NOT_FOUND_USER=404
}

/** 각 에러 코드에 대한 메시지 정의 */
const errorMessages: { [key: number]: string } = {
    501: "강제 에러 발생",
    502: "해당 값이 존재하지 않습니다.",
    400: "해당 카테고리는 존재하지 않습니다.",
    402: "해당 역은 존재하지 않습니다.",
    401: "해당 캘린더 정보가 존재하지 않습니다.",
    403: "해당 역의 열차 운행이 종료되었습니다.",
    404: "유저가 존재하지 않습니다."


};

export function errorMessage(code: ErrorCode): string {
    return errorMessages[code] || "알 수 없는 오류가 발생하였습니다.";
}