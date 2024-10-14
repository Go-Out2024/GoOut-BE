import { initializeDatabase } from "../../src/config/database";
import app from "../../src/index";
import request from "supertest";
import { Connection } from "typeorm";

let connection: Connection;

describe("WEATHER API", () => {
  beforeAll(async () => {
    connection = await initializeDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });

  describe("GET /api/weather/information", () => {
    it("200", (done) => {
      request(app)
        .get("/api/weather/information")
        .query({
          startName: "망월사",
          startType: "subway",
          endName: "경복궁역",
          endType: "bus",
          baseDate: "20241012", // 현재 날짜 0500부터 3시간 단위로 요청값
          baseTime: "1100",
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
