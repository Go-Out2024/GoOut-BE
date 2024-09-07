import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { HelmetMiddleware } from '../../../../src/middleware/before/HelmetMiddleware';

jest.mock('helmet');
(helmet as unknown as jest.Mock).mockReturnValue((req: Request, res: Response, next: NextFunction) => {
    next();
});



describe('HelmetMiddleware 테스트', () => {
    let helmetMiddleware: HelmetMiddleware;
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    beforeEach(() => {
        helmetMiddleware = new HelmetMiddleware();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('use 함수', () => {
        it('use 정상 테스트', () => {
            helmetMiddleware.use(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
});