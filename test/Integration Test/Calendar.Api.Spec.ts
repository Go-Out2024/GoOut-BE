import { initializeDatabase } from "../../src/config/database";
import { connectToRedis, redisClient } from "../../src/config/redis";
import {
  CalendarUpdate,
  CalendarUpdateContent,
} from "../../src/dto/request/CalendarUpdate";
import app from "../../src/index";
import request from "supertest";
import { Connection } from "typeorm";

let connection: Connection;
const ACCESS_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzI4NjM1NDIyLCJleHAiOjE3Mjg3MjE4MjJ9.MHWdJWXzgzRTMDxVHkmA7klGRlXPIwIQOiJBKtZ6hKA";
describe("CALENDAR API", () => {
  beforeAll(async () => {
    connection = await initializeDatabase();
    await connectToRedis();
  });

  afterAll(async () => {
    await connection.close();
    await redisClient.quit();
  });

  describe("POST /api/calendar/content", () => {
    it("200", (done) => {
      request(app)
        .post("/api/calendar/content")
        .set("Authorization", ACCESS_TOKEN)
        .send({
          calendarContent: [
            {
              content: "content",
              kind: "준비물",
              period: "매주",
              date: "2024-01-02",
            },
          ],
        })
        .expect(200)
        .end(done);
    });

    it("400", (done) => {
      request(app)
        .post("/api/calendar/content")
        .set("Authorization", ACCESS_TOKEN)
        .send({
          calendarContent: null,
        })
        .expect(400)
        .end(done);
    });
  });

  describe("GET /api/calendar/:date", () => {
    it("200", (done) => {
      const date = "2024-01-02";
      request(app)
        .get(`/api/calendar/${date}`)
        .set("Authorization", ACCESS_TOKEN)
        .expect(200)
        .end(done);
    });
  });

  describe("GET /api/calendar", () => {
    it("200", (done) => {
      request(app)
        .get(`/api/calendar`)
        .set("Authorization", ACCESS_TOKEN)
        .query({
          month: "2024-10",
        })
        .expect(200)
        .end(done);
    });
  });

  describe("PATCH /api/calendar/content", () => {
    it("200", (done) => {
      request(app)
        .patch("/api/calendar/content")
        .set("Authorization", ACCESS_TOKEN)
        .send({
          calendarContent: [
            {
              calendarId: 13,
              content: "Updated content",
              period: 30,
            },
          ],
        })
        .expect(200)
        .end(done);
    });

    it("400", (done) => {
      request(app)
        .patch("/api/calendar/content")
        .set("Authorization", ACCESS_TOKEN)
        .send({
          calendarContent: null,
        })
        .expect(400)
        .end(done);
    });
  });

  describe("DELETE /api/calendar/content", () => {
    it("200", (done) => {
      request(app)
        .delete("/api/calendar/content")
        .set("Authorization", ACCESS_TOKEN)
        .send({
          calendarIds: [13],
        })
        .expect(200)
        .end(done);
    });

    it("400", (done) => {
      request(app)
        .delete("/api/calendar/content")
        .set("Authorization", ACCESS_TOKEN)
        .send({
          calendarIds: null,
        })
        .expect(400)
        .end(done);
    });
  });
});
