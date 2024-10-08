import { initializeDatabase } from "../../src/config/database";
import { connectToRedis } from "../../src/config/redis";
import app from "../../src/index"; // 앱 인스턴스 가져오기
import request from "supertest";

const ACCESS_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzI4MzY3Mzk4LCJleHAiOjg2NTcyODM2NzM5OH0.ovs6W6lDuzwF2UO6kY6c-_6FQygEQ7lgV-duv_tbYno";
describe("User API", () => {
  beforeAll(async () => {
    await initializeDatabase(); // 데이터베이스 연결
    await connectToRedis(); // Redis 연결
  });

  afterAll(async () => {});

  it("GET /api/user/number", (done) => {
    request(app)
      .get("/api/user/number") // URL 수정: http://localhost:3000/api/user/number -> /api/user/number
      .set("Authorization", ACCESS_TOKEN)
      .expect(200)
      .end(done);
  });
});
