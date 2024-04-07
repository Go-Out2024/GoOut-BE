import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { HttpError } from 'routing-controllers';



export const generateAuthToken = (userId: number, userRole: string) => {
    const payload = {
      id: userId,
      role: userRole,
    };
    return 'Bearer ' +jwt.sign(payload, "secret", {
      algorithm: 'HS256',
      expiresIn: '30d',
    });
  }


const extractAuthToken = (req: Request) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
};

export const getAuthTokenBody = (req: Request, throwing = false) => {
    console.log(2)
    const token: string = extractAuthToken(req);
    console.log(3)
    try {
        console.log(4)
        const payload = jwt.verify(token,"secret");
        console.log(5)
        return typeof payload === 'string' ? JSON.parse(payload as string) : payload;
    } catch (e) {
        if (throwing) throw e;
    }
    return null;
};

export const compareAuthToken = (req: Request, res: Response, next: NextFunction = null): void => {
    try {
        console.log(1)
        const tokenBody = getAuthTokenBody(req, true);
        console.log(tokenBody)
        req.decoded = tokenBody;
     //   req.decoded.id= extractAuthToken(req);
        console.log(req.decoded.id)
    } catch (e) {
        throw new HttpError(401, 'INVALID_TOKEN');
    }
    if (next) next();
};




