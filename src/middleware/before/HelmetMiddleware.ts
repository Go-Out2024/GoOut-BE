import  helmet from 'helmet';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Service } from 'typedi';
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';

@Service()
@Middleware({ type: 'before' })
export class HelmetMiddleware implements ExpressMiddlewareInterface {
    private readonly handler: RequestHandler = helmet();

    public use(req: Request, res: Response, next: NextFunction): void {
        this.handler(req, res, next);
    }
}
