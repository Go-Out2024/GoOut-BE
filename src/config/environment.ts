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
  kakao:{
    key:process.env.KAKAO_KEY
  },
  prefix: process.env.PREFIX || '',
  apikey:{
    weatherapikey: process.env.WEATHER_API_KEY as string,
    openai: process.env.OPEN_AI_API_KEY as string,
    youtubeapikey: process.env.YOUTUBE_API_KEY as string,
    subwayapikey: process.env.SUBWAY_API_KEY as string,
    busapikey: process.env.BUS_API_KEY as string,
  },
};