import 'reflect-metadata';
import express from 'express';
import {Container} from 'typedi';
import { createServer, Server } from 'http';
import { useContainer, createExpressServer } from 'routing-controllers';
import { initializeDatabase } from './global/infrastructure/database.js';
import { envs } from './global/config/environment.js';
//import { TestController } from './domain/user/presentation/TestController.js';
import {ErrorHandler} from './global/exception/ErrorHandler.js'
import { generateAuthToken } from './global/middleware/jwtMiddleware.js';
import  compression from 'compression';
import { UserController } from './domain/user/presentation/UserController.js';
import { AuthController } from './domain/user/presentation/AuthController.js';

import { createRequire } from 'module'
import { TokenController } from './domain/user/presentation/TokenController.js';
const require = createRequire(import.meta.url)
require('dotenv').config();

export const app: express.Application = createExpressServer({
    controllers: [ UserController, AuthController, TokenController],
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
app.use(
    compression({
        filter: (req: express.Request, res: express.Response): boolean => {
            if (req.headers['x-no-compression']) return false;
            return compression.filter(req, res);
        },
    }),
);

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



