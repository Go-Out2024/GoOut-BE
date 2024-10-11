import { initializeDatabase } from "../../src/config/database";
import { connectToRedis, redisClient } from "../../src/config/redis";
import app from "../../src/index";
import request from "supertest";
import { Connection } from "typeorm";

let connection: Connection;
const ACCESS_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzI4NjM1NDIyLCJleHAiOjE3Mjg3MjE4MjJ9.MHWdJWXzgzRTMDxVHkmA7klGRlXPIwIQOiJBKtZ6hKA";
describe("USER API", () => {
  beforeAll(async () => {
    connection = await initializeDatabase();
    await connectToRedis();
  });

  afterAll(async () => {
    await connection.close();
    await redisClient.quit();
  });

  describe("GET /api/user/number", () => {
    it("200", (done) => {
      request(app)
        .get("/api/user/number")
        .set("Authorization", ACCESS_TOKEN)
        .expect(200)
        .end(done);
    });
  });

  describe("GET /api/user/number", () => {
    it("200", (done) => {
      request(app)
        .get("/api/user/email")
        .set("Authorization", ACCESS_TOKEN)
        .expect(200)
        .end(done);
    });
  });

  describe("POST /api/user/firebase-token", () => {
    it("200", (done) => {
      request(app)
        .post("/api/user/firebase-token")
        .set("Authorization", ACCESS_TOKEN)
        .send({
          token: "firebase-token",
        })
        .expect(200)
        .end(done);
    });

    it("400", (done) => {
      request(app)
        .post("/api/user/firebase-token")
        .set("Authorization", ACCESS_TOKEN)
        .send({
          token: null,
        })
        .expect(400)
        .end(done);
    });
  });

  describe("PATCH /api/user/alarm", () => {
    it("200", (done) => {
      request(app)
        .patch("/api/user/alarm")
        .set("Authorization", ACCESS_TOKEN)
        .send({
          status: true,
        })
        .expect(200)
        .end(done);
    });

    it("200", (done) => {
      request(app)
        .patch("/api/user/alarm")
        .set("Authorization", ACCESS_TOKEN)
        .send({
          status: false,
        })
        .expect(200)
        .end(done);
    });

    it("400", (done) => {
      request(app)
        .patch("/api/user/alarm")
        .set("Authorization", ACCESS_TOKEN)
        .send({
          status: null,
        })
        .expect(400)
        .end(done);
    });
  });

  describe("PATCH /api/user/time", () => {
    it("200", (done) => {
      request(app)
        .patch("/api/user/alarm/time")
        .set("Authorization", ACCESS_TOKEN)
        .send({
          alarmStart: "15:30:00",
          alarmEnd: "17:30:00",
        })
        .expect(200)
        .end(done);
    });

    it("400", (done) => {
      request(app)
        .patch("/api/user/alarm/time")
        .set("Authorization", ACCESS_TOKEN)
        .send({
          alarmStart: null,
          alarmEnd: null,
        })
        .expect(400)
        .end(done);
    });
  });

  // describe("DELETE /api/user", () => {
  //   it("200", (done) => {
  //     request(app)
  //       .delete("/api/user")
  //       .set("Authorization", ACCESS_TOKEN)
  //       .expect(200)
  //       .end(done);
  //   });
  // });
});
