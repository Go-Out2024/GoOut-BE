

export enum TestErrorCode  {
    
    ERROR = 501,
    NO_VALUE=502,
    UNAUTHORIZED = 1001,
    
}

// 각 에러 코드에 대한 메시지 정의
const ErrorMessages: { [key: number]: string } = {
    501: "강제 에러 발생",
    502: "해당 값이 존재하지 않습니다."

};

export function errorMessage(code: TestErrorCode): string {
    return ErrorMessages[code] || "알 수 없는 오류가 발생하였습니다.";
}