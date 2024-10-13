import { initializeDatabase } from "../../src/config/database";
import { connectToRedis, redisClient } from "../../src/config/redis";
import app from "../../src/index";
import request from "supertest";
import { Connection } from "typeorm";

let connection: Connection;
const ACCESS_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MjgwMzM5MTgsImV4cCI6MTczMDYyNTkxOH0.wR6jOwKJwRhiuHjbOqXORhxTPGrTLt0FZU6LC7hNF6E";

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