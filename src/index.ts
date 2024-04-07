import 'reflect-metadata';
import * as express from 'express';
import {Container} from 'typedi';
import { createServer, Server } from 'http';
import { useContainer, createExpressServer } from 'routing-controllers';
import { initializeDatabase } from './global/infrastructure/database.js';
import { envs } from './global/config/environment.js';
import { TestController } from './domain/exemple/presentation/TestController.js';
import {ErrorHandler} from './global/exception/ErrorHandler.js'
import { generateAuthToken } from './global/middleware/jwtMiddleware.js';

export const app: express.Application = createExpressServer({
    controllers: [TestController],
    middlewares: [ErrorHandler],

    routePrefix: envs.prefix,
    cors: {
        origin: `http://localhost`
    },
    defaultErrorHandler: true,
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// gzip HTTP Content
// app.use(
//     compression({
//         filter: (req: express.Request, res: express.Response): boolean => {
//             if (req.headers['x-no-compression']) return false;
//             return compression.filter(req, res);
//         },
//     }),
// );

console.log(generateAuthToken(1,"USER"))
let isKeepAlive = true;
app.use(function (req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (!isKeepAlive) {
        
        res.set('Connection', 'close');
    
    }
    next();
});


useContainer(Container);
initializeDatabase()
    .then(() => {
        console.log('Database connected.');

        const httpServer: Server = createServer(app);
        httpServer.listen(envs.port, () => {
      
            app.emit('started');
          
        });
        process.on('SIGINT', function () {

            isKeepAlive = false;
            httpServer.close(function (): void {
    
                process.exit(0);
            });
        });
    })
    .catch(e => {
        console.error(`Express running failure : ${e}`);
        console.log(e);
    });



