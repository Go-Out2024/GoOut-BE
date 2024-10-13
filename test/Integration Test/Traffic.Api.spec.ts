import { initializeDatabase } from "../../src/config/database";
import { connectToRedis, redisClient } from "../../src/config/redis";
import { CollectionErase } from "../../src/dto/request/CollectionErase";
import { CollectionInsert } from "../../src/dto/request/CollectionInsert";
import app from "../../src/index";
import request from "supertest";
import { Connection } from "typeorm";

let connection: Connection;
const ACCESS_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MjgwMzM5MTgsImV4cCI6MTczMDYyNTkxOH0.wR6jOwKJwRhiuHjbOqXORhxTPGrTLt0FZU6LC7hNF6E";

describe("TRAFFIC API", () => {
  beforeAll(async () => {
    connection = await initializeDatabase();
    await connectToRedis();
  });

  afterAll(async () => {
    await connection.close();
    await redisClient.quit();
  });

  describe("POST /api/traffic/collection", () => {
    it("200", (done) => {
      request(app)
        .post("/api/traffic/collection")
        .set("Authorization", ACCESS_TOKEN)
        .send({
            name: "테스트 꿀잼 마지막",
            goToWork: {
                status: "goToWork",
                departure: {
                    route: "departure",
                    type: "Subway",
                    name: "망월사",
                    numbers: ["1001"]
                },
                arrival: {
                    route: "arrival",
                    type: "Bus",
                    name: "경복궁역",
                    numbers: ["1020", "1711"]
                }
            }
        }
        )
        .expect(200)
        .end(done);
    });

    it("400", (done) => {
      request(app)
        .post("/api/traffic/collection")
        .set("Authorization", ACCESS_TOKEN)
        .send({
          name: null,
        })
        .expect(400)
        .end(done);
    });
  });

  describe("DELETE /api/traffic/collection", () => {
    it("200", (done) => {
      request(app)
        .delete("/api/traffic/collection")
        .set("Authorization", ACCESS_TOKEN)
        .send({
            collectionId: 3
            })
        .expect(200)
        .end(done);
    });

    it("400", (done) => {
      request(app)
        .delete("/api/traffic/collection")
        .set("Authorization", ACCESS_TOKEN)
        .send({
          collectionId: null,
        })
        .expect(400)
        .end(done);
    });
  });

  describe("PATCH /api/traffic/collection/name", () => {
    it("200", (done) => {
      request(app)
        .patch("/api/traffic/collection/name")
        .set("Authorization", ACCESS_TOKEN)
        .send({
          collectionId: 4,
          name: "test collection`s name update",
        })
        .expect(200)
        .end(done);
    });

    it("400", (done) => {
      request(app)
        .patch("/api/traffic/collection/name")
        .set("Authorization", ACCESS_TOKEN)
        .send({
          collectionId: null,
          Name: null,
        })
        .expect(400)
        .end(done);
    });
  });

  describe("PATCH /api/traffic/collection/detail", () => {
    it("200", (done) => {
      request(app)
        .patch("/api/traffic/collection/detail")
        .set("Authorization", ACCESS_TOKEN)
        .send({
            collectionId: 4,
            goToWork: {
                status: "goToWork",
                departure: {
                    route: "departure",
                    type: "Subway",
                    name: "창동",
                    numbers: ["1001"]
                },
                arrival: {
                    route: "arrival",
                    type: "Bus",
                    name: "경복고교역",
                    numbers: ["1020", "1711"]
                }
            },
            goHome: {
                status: "goToWork",
                departure: {
                    route: "departure",
                    type: "Subway",
                    name: "도봉산",
                    numbers: ["1001"]
                },
                arrival: {
                    route: "arrival",
                    type: "Bus",
                    name: "경복궁역",
                    numbers: ["1020", "1711"]
                }
            },
    })
        .expect(200)
        .end(done);
    });

    it("400", (done) => {
      request(app)
        .patch("/api/traffic/collection/detail")
        .set("Authorization", ACCESS_TOKEN)
        .send({
          collectionId: null,
          goToWork: null,
          goHome: null
        })
        .expect(400)
        .end(done);
    });
  });

  describe("GET /api/traffic/collection", () => {
    it("200", (done) => {
      request(app)
        .get("/api/traffic/collection")
        .set("Authorization", ACCESS_TOKEN)
        .expect(200)
        .end(done);
    });
  });

  describe("GET /api/traffic/collection/detail", () => {
    it("200", (done) => {
      request(app)
        .get("/api/traffic/collection/detail")
        .set("Authorization", ACCESS_TOKEN)
        .send({
            collectionId: 4
        })
        .expect(200)
        .end(done);
    });

    it("400", (done) => {
        request(app)
          .get("/api/traffic/collection/detail")
          .set("Authorization", ACCESS_TOKEN)
          .send({
            collectionId: null,
          })
          .expect(400)
          .end(done);
      });
  });

  describe("POST /api/traffic/collection/choice", () => {
    it("200", (done) => {
      request(app)
        .post("/api/traffic/collection/choice")
        .set("Authorization", ACCESS_TOKEN)
        .send({
            collectionId: 17
        })
        .expect(200)
        .end(done);
    });

    it("400", (done) => {
        request(app)
          .post("/api/traffic/collection/choice")
          .set("Authorization", ACCESS_TOKEN)
          .send({
            collectionId: null,
          })
          .expect(400)
          .end(done);
      });
  });

  describe("GET /api/traffic/collection/main", () => {
    it("200", (done) => {
      request(app)
        .get("/api/traffic/collection/main")
        .set("Authorization", ACCESS_TOKEN)
        .expect(200)
        .end(done);
    });
  });

  describe("GET /api/traffic/collection/change", () => {
    it("200", (done) => {
      request(app)
        .get("/api/traffic/collection/change")
        .set("Authorization", ACCESS_TOKEN)
        .send({
            status: "goHome"
        })
        .expect(200)
        .end(done);
    });

    it("400", (done) => {
        request(app)
          .get("/api/traffic/collection/change")
          .set("Authorization", ACCESS_TOKEN)
          .send({
              status: null
          })
          .expect(400)
          .end(done);
      });
  });

  describe("GET /api/traffic/time-information", () => {
    it("200", (done) => {
      request(app)
        .get("/api/traffic/time-information")
        .query({ stationName: "경복궁역" })
        .expect(200)
        .end(done);
    });
  });

  describe("GET /api/traffic/related-search", () => {
    it("200", (done) => {
      request(app)
        .get("/api/traffic/related-search")
        .query({ searchTerm: "녹사" })
        .expect(200)
        .end(done);
    });
  });

  describe("GET /api/traffic/time-information/subway", () => {
    it("200", (done) => {
      request(app)
        .get("/api/traffic/time-information/subway")
        .query({ subwayName: "녹사평" })
        .expect(200)
        .end(done);
    });
  });

  describe("GET /api/traffic/time-information/bus", () => {
    it("200", (done) => {
      request(app)
        .get("/api/traffic/time-information/bus")
        .query({ stationName: "경기상고", busStationId: 100000006 })
        .expect(200)
        .end(done);
    });
  });
});