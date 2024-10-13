import { initializeDatabase } from "../../src/config/database";
import app from "../../src/index";
import request from "supertest";
import { Connection } from "typeorm";
import { redisClient, connectToRedis } from "../../src/config/redis";

let connection: Connection;
// 로그인 시 발급 받은 리프레스 토큰
const REFRESH_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzI4ODAwMzE2LCJleHAiOjE3Mjg5NzMxMTZ9.S2yJLaVc6Tha7hLnd8e7q-pQ8Dvi-8e_cYa6_TsArXE";
const INVALID_REFRESH_TOKEN = 'Bearer askjdlksdjg10249083'
describe("TOKEN API", () => {
  beforeAll(async () => {
    connection = await initializeDatabase();
    await connectToRedis();
  });

  afterAll(async () => {
    await connection.close();
    await redisClient.quit();
  });

  describe("POST /api/auth/refresh-token", () => {
    it("200", (done) => {
      request(app)
        .post("/api/auth/refresh-token")
        .set("Authorization", REFRESH_TOKEN)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty("data");
          expect(res.body.data).toHaveProperty("accessToken");
          expect(res.body.data).toHaveProperty("refreshToken");
        })
        .end(done);
    });

      it("500", (done) => {
        request(app)
          .post("/api/auth/refresh-token")
          .set("Authorization", INVALID_REFRESH_TOKEN)
          .expect(500)
          .end(done);
      });
  });
});