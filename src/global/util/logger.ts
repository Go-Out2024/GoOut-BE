
import { createRequire } from 'module'
import   TransportStream  from 'winston-transport';
import winston, { createLogger, transports, format } from 'winston';
import { Service } from 'typedi';


const require = createRequire(import.meta.url)
require('dotenv').config();




class DatabaseTransport extends TransportStream {

 
    async log(info: { level : string, timestamp : Date, message : string}, callback: () => void) {
        setImmediate(() => {
        this.emit('logged', info);
        });
        try {
        const { level,  message, timestamp } = info;

        // 에러로그 저장 로직 추가
        console.log('로그가 데이터베이스에 저장되었습니다.');
        } catch (error) {
        console.error('데이터베이스에 로그 저장 중 오류 발생');
        }
        callback();
    }
}



export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss.SSS',
        }),
    ),
    transports: [
       new DatabaseTransport(),
    ],
});

