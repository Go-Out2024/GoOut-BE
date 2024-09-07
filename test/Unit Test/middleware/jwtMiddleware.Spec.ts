import { NextFunction, Request } from "express";
import {compareAuthToken, extractAuthToken, getAuthTokenBody} from '../../../src/middleware/jwtMiddleware';
import jwt from 'jsonwebtoken';
import { ITokenBody } from "../../../src/middleware/jwtMiddleware";
import { HttpError } from "routing-controllers";

declare module 'express-serve-static-core' {
    interface Request {
        decoded?: { id: number };
    }
}

jest.mock('jsonwebtoken')
const mockJwt = jwt as jest.Mocked<typeof jwt>;

describe('jwtMiddleware 테스트', () => {
    let next: NextFunction;

    beforeEach(() => {
        next = jest.fn();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('extractAuthToken 함수', () => {
        it('extractAuthToken 정상 테스트', () => {
            const req = {headers:{authorization:"Bearer token"}} as Request;
            const result = extractAuthToken(req);
            expect(result).toEqual("token");
        });

        it('extractAuthToken 토큰 Bearer 형식 에러 테스트', () => {
            const req = {headers:{authorization:"Bear token"}} as Request;
            const result = extractAuthToken(req);
            expect(result).toEqual(undefined);
        });

        it('extractAuthToken req.headers.authorization 에러 테스트', () => {
            const req = {headers:{}} as Request;
            const result = extractAuthToken(req);
            expect(result).toEqual(undefined);
        });
   
    });



    describe('getAuthTokenBody 함수', () => {
        const req = {headers:{authorization:"Bearer token"}} as Request;
   
        it('getAuthTokenBody 정상 테스트1', () => {
            const payload = '{ "key": "value" }';
            const thorwing = false;
            (mockJwt.verify as jest.Mock).mockReturnValue(JSON.parse(payload));
            const result = getAuthTokenBody(req, thorwing);
            expect(result).toEqual(JSON.parse(payload))
            expect(mockJwt.verify).toHaveBeenCalledWith("token","secret");
        });

        it('getAuthTokenBody 정상 테스트2', () => {
            const payload = { "key": "value" };
            const thorwing = false;
            (mockJwt.verify as jest.Mock).mockReturnValue(payload);
            const result = getAuthTokenBody(req, thorwing);
            expect(result).toEqual(payload)
            expect(mockJwt.verify).toHaveBeenCalledWith("token","secret");
        });

        it('getAuthTokenBody 에러 테스트', () => {
            const thorwing = false;
            (mockJwt.verify as jest.Mock).mockReturnValue('{ invalid_json }');
            const result = getAuthTokenBody(req, thorwing);
            expect(result).toBeUndefined();
            expect(mockJwt.verify).toHaveBeenCalledWith('token', 'secret')
        });
   });

    describe('compareAuthToken 함수', () => {
        const req = { headers: { authorization: "Bearer token" } } as unknown as Request;
        const mockTokenBody = { id: 1, role: "USER" } as unknown as ITokenBody;

        beforeEach(() => {
            (mockJwt.verify as jest.Mock).mockReturnValue(mockTokenBody);
        });

        it('compareAuthToken 정상 테스트', () => {
            compareAuthToken(req, next);
            expect(req.decoded).toEqual(mockTokenBody);
            expect(next).toHaveBeenCalled();
        });

        it('compareAuthToken 에러 테스트 - getAuthTokenBody에서 에러 발생', () => {
            (mockJwt.verify as jest.Mock).mockImplementation(() => { throw new Error('JWT verification failed'); });
            expect(() => {
                compareAuthToken(req, next);
            }).toThrow(new HttpError(401, 'INVALID_TOKEN'));
            expect(next).not.toHaveBeenCalled();
        });


      
    });


});