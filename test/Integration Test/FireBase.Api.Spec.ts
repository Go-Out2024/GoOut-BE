import { initializeDatabase } from "../../src/config/database";
import { connectToRedis, redisClient } from "../../src/config/redis";
import app from "../../src/index";
import request from "supertest";
import { Connection } from "typeorm";

let connection: Connection;
const ACCESS_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzI4NDQ4MzE1LCJleHAiOjE3Mjg1MzQ3MTV9.TJrswaNx3n7Wwb-zkCwbdwt9GvJHWtFvpRKV3F_5Uck";

describe("FIREBASE API", () => {
  beforeAll(async () => {
    connection = await initializeDatabase();
    await connectToRedis();
  });

  afterAll(async () => {
    await connection.close();
    await redisClient.quit();
  });

  describe("GET /api/notice/send", () => {
    it("200", (done) => {
      request(app)
        .post("/api/notice/send")
        .set("Authorization", ACCESS_TOKEN)
        .send({
          engineValue: "engine-value",
        })
        .expect(200)
        .end(done);
    });

    it("400", (done) => {
      request(app)
        .post("/api/notice/send")
        .set("Authorization", ACCESS_TOKEN)
        .send({
          engineValue: null,
        })
        .expect(400)
        .end(done);
    });
  });
});
