import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { ErrorCode, errorMessage } from '../exception/ErrorCode'; // ErrorCode와 errorMessage를 가져옵니다.
import { ErrorResponseDto } from '../response/ErrorResponseDto';

@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, req: Request, res: Response, next: NextFunction): void {
        console.error(
            `Middelware Handler - ${req.method} ${req.url}\n${error}\n${JSON.stringify(req.body)}`,
        );

        let code: number;
        let message: string;

      
        if (error instanceof ErrorResponseDto) {
           
            code = error.getCode();
            message = error.getMessage();
        } else {
            code = error.httpCode || 500;
            message = error.message || '서버 에러';
        }

        const response = {
            code: code,
            message: message
        };

        res.status(500).send(response);
        next(error);
    }
}
