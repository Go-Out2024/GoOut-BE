import 'reflect-metadata';
import * as express from 'express';

import Container from 'typedi';
import { createServer, Server } from 'http';
import { useContainer, createExpressServer } from 'routing-controllers';
import { envs } from './domain/exemple/config/environment.js';
import {database} from './domain/exemple/infrastructure/database.js';
import { join } from 'path';
import url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const app: express.Application = createExpressServer({
    controllers: [`${join(__dirname, '..')}/controllers/*{.js,.ts}`],
    middlewares: [`${join(__dirname, '..')}/middlewares/**/*{.js,.ts}`],
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

// import express from 'express';

// const app = express();


// const port = process.env.PORT || 3000;

// app.use(express.json());

// app.use(express.urlencoded({ extended: true }));



// app.all('/*', function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
//   res.setHeader('Access-Control-Allow-Credentials', "true");
//   next();
// });

// app.all("",(res, req) => {
//   console.log("HI");
// })

// app.get('/healthcheck', (req, res) => {
//   res.status(200).send();
// });

// app.listen(port, () => {
//   console.log(`
//     ################################################
//           🛡️  Server listening on port: ${port} 🛡️
//     ################################################
//   `);
//   console.info('Writon Server Start');

// })


// // // api 요청 시 해당 경로가 없을 때
// // app.use((req, res, next) => {
// //   next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
// // });




// export default app;




