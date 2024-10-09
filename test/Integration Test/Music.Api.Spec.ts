import { initializeDatabase } from "../../src/config/database";
import { connectToRedis, redisClient } from "../../src/config/redis";
import app from "../../src/index";
import request from "supertest";
import { Connection } from "typeorm";

let connection: Connection;

describe("MUSIC API", () => {
  beforeAll(async () => {
    connection = await initializeDatabase();
    await connectToRedis();
  });

  afterAll(async () => {
    await connection.close();
    await redisClient.quit();
  });

  describe("GET /api/music/recommend", () => {
    it("200", (done) => {
      request(app).get("/api/music/recommend").expect(200).end(done);
    });
  });
});
