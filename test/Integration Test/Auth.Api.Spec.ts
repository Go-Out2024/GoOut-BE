import { after } from "node:test";
import { initializeDatabase } from "../../src/config/database";
import { connectToRedis, redisClient } from "../../src/config/redis";
import app from "../../src/index";
import { Connection } from 'typeorm';
import request from "supertest";
import { refreshToken } from "firebase-admin/app";

let connection: Connection;

const ACCESS_TOKEN = 'lqM3Woy2lNdkhLMwNhRz2wiiguuMW8eYAAAAAQo9cuoAAAGShFjkbsO6S6yUo1la'//카카오에서 받은 엑세스 토큰
const REFRESH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzI4Nzk3Mzc4LCJleHAiOjE3Mjg5NzAxNzh9.IB6-54QpBTd51Vuhro47JPl6fZSyoPXJ9Db9zHLlM2k'//로그인 시 발급 받은 리프레스 토큰
const FIREBASE_TOKEN = 'firebase-token'//유저가 알림 등록 시 등록한 파이어베이스 토큰

describe("AUTH API", () => {
    beforeAll(async () => {
        connection = await initializeDatabase();
        await connectToRedis();
    });

    after(async () => {
        await connection.close();
        await redisClient.quit();
    });

    describe("POST /api/auth/login", () => {
        it("200", (done) => {
          request(app)
            .post("/api/auth/login")
            .set("Authorization", ACCESS_TOKEN)
            .expect(200)
            .expect((res) => {
              expect(res.body).toHaveProperty("data");
              expect(res.body.data).toHaveProperty("accessToken");
              expect(res.body.data).toHaveProperty("refreshToken");
            })
            .end(done);
        });
      });

    describe("DELETE api/auth/logout", () => {
        it('200', (done) => {
          request(app)
            .delete("/api/auth/logout")
            .send({ refreshToken: REFRESH_TOKEN, firebaseToken: FIREBASE_TOKEN})
            .expect(200)
            .end(done);
        })
    })
})
