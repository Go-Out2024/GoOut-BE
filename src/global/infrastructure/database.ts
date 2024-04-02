
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource } from 'typeorm';
import {
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
} from 'typeorm';

import { validateOrReject } from 'class-validator';
import { join } from 'path';
import url from 'url';
import { envs } from '../config/environment';
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

export async function  database():  Promise<DataSource>  {
 
      const ds = new DataSource({
        name: 'default',
        type: 'mysql',
        host: envs.db.host,
        port: envs.db.port,
        username: envs.db.username,
        password: envs.db.password,
        database: envs.db.database,
        logging: envs.isProd === false,
        synchronize: false,
        entities: [`${join(__dirname, '../../')}/domain/**/*/*.{js,ts}`],
        namingStrategy: new SnakeNamingStrategy(),
      });
      return ds.initialize();
    
  };