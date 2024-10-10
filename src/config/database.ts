import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { Connection, createConnection, useContainer } from "typeorm";
import { BaseEntity, BeforeInsert, BeforeUpdate } from "typeorm";
import { validateOrReject } from "class-validator";
import { envs } from "./environment";
import { Container } from "typedi";
import path from "path";

/**
 * Before insert/update validation data
 */
export abstract class ValidationEntity extends BaseEntity {
  @BeforeInsert()
  @BeforeUpdate()
  async validate(): Promise<void> {
    await validateOrReject(this);
  }
}

export async function initializeDatabase() {
  try {
    useContainer(Container);

    // 엔티티 파일을 동적으로 불러와서 배열에 추가
    //   const entities = entityFiles.map(file => require(file).default);
    const connection = await createConnection({
      name: "default",
      type: "mysql",
      host: envs.db.host,
      port: envs.db.port,
      username: envs.db.username,
      password: envs.db.password,
      database: envs.db.database,
      logging: envs.isProd === false,
      synchronize: true,
      entities: [path.join(__dirname, "../entity/*.{js,ts}")],
      namingStrategy: new SnakeNamingStrategy(),
    });

    Container.set(Connection, connection);
    return connection;
  } catch (err) {
    console.error("데이터베이스 초기화 중 오류 발생", err);
    throw err;
  }
}
