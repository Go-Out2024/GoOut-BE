// import { Request, Response, NextFunction } from 'express';
// import { Service } from 'typedi';
// import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
// import { BadRequestError } from 'routing-controllers';

// @Middleware({ type: 'before' })
// @Service()
// export class ValidateErrorHandler implements ExpressErrorMiddlewareInterface {

//     private code: number;
//     private message: string;

//     error(error: any, req: Request, res: Response, next: NextFunction): void {
//         console.error(
//             `Custom Error Handler - ${req.method} ${req.url}\n${error}\n${JSON.stringify(req.body)}`,
//         );

//         if (error instanceof BadRequestError) {
//             // const customErrors = (error as BadRequestError).errors.map((e: any) => ({
//             //     property: e.property,
//             //     message: e.constraints[Object.keys(e.constraints)[0]]
//             // }));

//             console.log(12)
            

//             res.status(400).json({
//                 code: 400,
//                 message: 'Bad Request',
//           //      errors: customErrors,
//             });
//         } else {
//             res.status(500).json({
//                 code: 500,
//                 message: 'Internal Server Error',
//             });
//         }
//     }
// }
