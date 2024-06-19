
import {Request} from "express";

interface decodedToken {
    id: number;
  }

declare global{

  namespace Express {
    export interface Request {
      decoded :decodedToken;
      user: decodedToken;
    }
  }
}


// import { Request, Response } from 'express';
// export interface IUserAddedRequest extends Request {
//     decoded: number; 
//   }
