import 'reflect-metadata';
import * as express from 'express';
import Container from 'typedi';
import { createServer, Server } from 'http';
import { useContainer, createExpressServer } from 'routing-controllers';
import { join } from 'path';
import url from 'url';
import { database } from './global/infrastructure/database.js';
import { envs } from './global/config/environment.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));



export const app: express.Application = createExpressServer({
    controllers: [`${__dirname}/domain/example/presentation/*{.js,.ts}`],
 //   middlewares: [`${join(__dirname, '..')}/src/global/exception/*{.js,.ts}`],

    routePrefix: envs.prefix,
    cors: {
        origin: `http://localhost`,
    },
    defaultErrorHandler: false,
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


let isKeepAlive = true;
app.use(function (req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (!isKeepAlive) {
        res.set('Connection', 'close');
    
    }
    next();
});

useContainer(Container);

database()
    .then(() => {
        console.log('Database connected.');

        const httpServer: Server = createServer(app);
        httpServer.listen(envs.port, () => {
      
            // Mocha running before
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



