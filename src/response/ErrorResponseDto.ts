import { Service } from "typedi";
import { TestErrorCode, errorMessage } from "../exception/TestErrorCode.js";


export class ErrorResponseDto<T> {
    private readonly code: number;
    private readonly message: string;

    public static of<T>(code: TestErrorCode): ErrorResponseDto<T> {
        return new ErrorResponseDto<T>(code, errorMessage(code));
    }

    private constructor(code: number, message: string) {
        this.code = code;
        this.message = message;
     
    }

    public getCode(): number{
        return this.code;
    }

    public getMessage(): string{
        return this.message;
    }

}
