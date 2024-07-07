
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
import { Calendar } from '../entity/Calendar.js';
import { TrafficCollection } from '../entity/TrafficCollection.js';
import { TrafficCollectionDetail } from '../entity/TrafficCollectionDetail.js';
import { Transportation } from '../entity/Transportation.js';
import { BusStation } from '../entity/BusStation.js';
import { Bus } from '../entity/Bus.js';
import { SubwayStation } from '../entity/SubwayStation.js';
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
            entities: [User,FirebaseToken,Calendar, TrafficCollection, TrafficCollectionDetail, Transportation, BusStation, Bus, SubwayStation],
            namingStrategy: new SnakeNamingStrategy(),
        });
        return connection;
    } catch (err) {
        console.error("데이터베이스 초기화 중 오류 발생", err);
        throw err;
    }
}