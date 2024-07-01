
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import {  createConnection, useContainer} from 'typeorm';
import {
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
} from 'typeorm';
import {  validateOrReject } from 'class-validator';
import { join } from 'path';
import url from 'url';
import { envs } from './environment.js';
import {Container} from 'typedi';
import { User } from '../entity/User.js';
import { FirebaseToken } from '../entity/FirebaseToken.js';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
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
    
        const connection = await createConnection({
            name: 'default',
            type: 'mysql',
            host: envs.db.host,
            port: envs.db.port,
            username: envs.db.username,
            password: envs.db.password,
            database: envs.db.database,
            logging: envs.isProd === false,
            synchronize: true,
            entities: [User,FirebaseToken],
            namingStrategy: new SnakeNamingStrategy(),
        });
        return connection;
    } catch (err) {
        console.error("데이터베이스 초기화 중 오류 발생", err);
        throw err;
    }
}