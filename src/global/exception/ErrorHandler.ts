import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { Middleware, ExpressErrorMiddlewareInterface, BadRequestError, InternalServerError } from 'routing-controllers';
import { ErrorResponseDto } from '../response/ErrorResponseDto';

@Middleware({ type: 'after' })
@Service()
export class ErrorHandler implements ExpressErrorMiddlewareInterface {

    private code: number;
    private message: string;

    error(error: any, req: Request, res: Response, next: NextFunction): void {
        console.error(
            `Middelware Handler - ${req.method} ${req.url}\n${error}\n${JSON.stringify(req.body)}`,
        );

 
        this.divideError(error);
        const response = {
            code: this.getCode(),
            message: this.getMessage()
        };
        res.status(this.getCode()).send(response);
        next();
    }

    private getCode() {
        return this.code;
    }

    private getMessage() {
        return this.message;
    }

    private divideError(error: any) {
 
        if (error instanceof ErrorResponseDto) {
            this.code = error.getCode();
            this.message = error.getMessage();
        } else if (error instanceof BadRequestError) {
            this.code =  400;
            this.message ='옳바른 요청이 아닙니다.';
        } else if(error instanceof InternalServerError){
            this.code=502;
            this.message="서버 내부에 문제가 있습니다."

        } else {
            this.code = error.httpCode || 500;
            this.message = error.message || '서버 에러';
        }
    }
}
