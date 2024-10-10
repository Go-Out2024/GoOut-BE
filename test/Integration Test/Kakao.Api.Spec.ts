import { initializeDatabase } from "../../src/config/database";
import { connectToRedis, redisClient } from "../../src/config/redis";
import app from "../../src/index";
import request from "supertest";
import { Connection } from "typeorm";

let connection: Connection;

describe("KAKAO EATERY API", () => {
  beforeAll(async () => {
    connection = await initializeDatabase();
    await connectToRedis();
  });

  afterAll(async () => {
    await connection.close();
    await redisClient.quit();
  });

  describe("GET /api/kakao/eateries", () => {
    it("200", (done) => {
      request(app)
        .get("/api/kakao/eateries")
        .query({
          x: "126.97224578759753",
          y: "37.53599611679934",
          category: "음식점",
          radius: "1000",
          page: "1",
          size: "10",
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty("data");
          expect(res.body.data).toBeInstanceOf(Object);
        })
        .end(done);
    });
  });
});
