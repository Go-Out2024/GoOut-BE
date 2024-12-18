import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpError } from 'routing-controllers';

export interface ITokenBody {
  id: number;
  role: string;
}



export const extractAuthToken = (req: Request) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
};

export const getAuthTokenBody = (req: Request, throwing :boolean) => {

    const token: string = extractAuthToken(req);
   
    try {
        const payload = jwt.verify(token,"secret") ;
        return typeof payload === 'string' ? JSON.parse(payload as string) : payload;
    } catch (e) {
        if (throwing) throw e;
    }
};

export const compareAuthToken = (req:Request, res: Response,next: NextFunction): void => {
    try {
        const tokenBody : ITokenBody= getAuthTokenBody(req, true);
        req.decoded = tokenBody;
   
    } catch (e) {
        throw new HttpError(401, 'INVALID_TOKEN');
    }      
    next();
};




