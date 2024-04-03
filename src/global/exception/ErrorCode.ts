

export enum ErrorCode  {
    
    ERROR = 501,
    UNAUTHORIZED = 1001,
    
}

// 각 에러 코드에 대한 메시지 정의
const ErrorMessages: { [key: number]: string } = {
    501: "강제 에러 발생",

};

export function errorMessage(code: ErrorCode): string {
    return ErrorMessages[code] || "알 수 없는 오류가 발생하였습니다.";
}