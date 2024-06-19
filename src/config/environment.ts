import * as dotenv from 'dotenv';

dotenv.config();

export const envs = {
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV as string,
  isProd: process.env.NODE_ENV === 'production',
  db: {
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
  },
  redis:{
    host:process.env.AWS_REDIS_ENDPOINT as string,
    port:process.env.AWS_REDIS_PORT as string
  },
  prefix: process.env.PREFIX || '',
};