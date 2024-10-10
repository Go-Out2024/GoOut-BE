import "reflect-metadata";
import express from "express";
import { Container } from "typedi";
import { createServer, Server } from "http";
import { useContainer, createExpressServer } from "routing-controllers";
import { initializeDatabase } from "./config/database";
import { envs } from "./config/environment";
import { ErrorHandler } from "./exception/ErrorHandler";
import compression from "compression";
import { UserController } from "./controller/User.Controller";
import { AuthController } from "./controller/Auth.Controller";
import { TokenController } from "./controller/Token.Controller";
import { FirebaseController } from "./controller/Firebase.Controller";
import { KakaoController } from "./controller/Kakao.Controller";
import { FamousSayingController } from "./controller/FamousSaying.Controller";
import { WeatherController } from "./controller/Weather.Controller";
import { CalendarController } from "./controller/Calendar.Controller";
import { MusicController } from "./controller/Music.Controller";
import { handleAlarm, settingRecommendMusic } from "./util/scheduler";
import { TrafficController } from "./controller/Traffic.Controller";
import { connectToRedis } from "./config/redis";

import SubwayStationImportService from "./service/StationInfoUpdate.Service"; // Import SubwayStationImportService
import * as path from "path"; // CSV 파일 경로를 위해 필요

export const app: express.Application = createExpressServer({
  controllers: [
    UserController,
    AuthController,
    TokenController,
    FirebaseController,
    KakaoController,
    FamousSayingController,
    WeatherController,
    TrafficController,
    CalendarController,
    MusicController,
  ],

  middlewares: [ErrorHandler],

  routePrefix: envs.prefix,
  cors: {
    origin: `http://localhost`,
  },
  defaultErrorHandler: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// gzip HTTP Content
app.use(
  compression({
    filter: (req: express.Request, res: express.Response): boolean => {
      if (req.headers["x-no-compression"]) return false;
      return compression.filter(req, res);
    },
  })
);

let isKeepAlive = true;
app.use(function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  if (!isKeepAlive) {
    res.set("Connection", "close");
  }
  next();
});

useContainer(Container);

const httpServer: Server = createServer(app);
httpServer.listen(envs.port, async () => {
  await settingRecommendMusic();
  await handleAlarm();
  connectToRedis();
  await initializeDatabase();
  // CSV 파일 경로 설정
  const subwayFilePath = path.resolve(__dirname, "../../src/util/subway4.csv"); // 파일 경로 지정

  // CSV 파일 데이터 SubwayStation 테이블에 저장
  await SubwayStationImportService.importSubwayStations(subwayFilePath);

  app.emit("started");
});

process.on("SIGINT", function () {
  isKeepAlive = false;
  httpServer.close(function (): void {
    process.exit(0);
  });
});

export default app;