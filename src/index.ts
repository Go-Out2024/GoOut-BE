import 'reflect-metadata';
import express from 'express';
import {Container} from 'typedi';
import { createServer, Server } from 'http';
import { useContainer, createExpressServer } from 'routing-controllers';
import { initializeDatabase } from './config/database.js';
import { envs } from './config/environment.js';
import {ErrorHandler} from './exception/ErrorHandler.js'
import { generateAuthToken } from './middleware/jwtMiddleware.js';
import  compression from 'compression';
import { UserController } from './controller/User.Controller.js';
import { AuthController } from './controller/Auth.Controller.js';
import { createRequire } from 'module'
import { TokenController } from './controller/Token.Controller.js';
import { FirebaseController } from './controller/Firebase.Controller.js';
import { KakaoController } from './controller/Kakao.Controller.js';
import * as path from 'path';
import {fileURLToPath} from 'url';
import { FamousSayingController } from './controller/FamousSaying.Controller.js';
import { WeatherController } from './controller/Weather.Controller.js';
import { CalendarController } from './controller/Calendar.Controller.js';
import { MusicController } from './controller/Music.Controller.js';
import { settingRecommendMusic } from './util/scheduler.js';
import { TrafficController } from './controller/Traffic.Controller.js';


const require = createRequire(import.meta.url)
require('dotenv').config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const app: express.Application = createExpressServer({

    controllers: [ UserController, AuthController, TokenController, FirebaseController, KakaoController,
         FamousSayingController, WeatherController, CalendarController, MusicController],

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
    .then(async () => {
        console.log('Database connected.');

        const httpServer: Server = createServer(app);
        httpServer.listen(envs.port, async () => {
            await settingRecommendMusic()
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