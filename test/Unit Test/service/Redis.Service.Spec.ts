import {RedisService} from '../../../src/service/Redis.Service';
import { redisClient } from "../../../src/config/redis";

jest.mock('../../../src/config/redis', () => ({
    redisClient: { 
        set: jest.fn(),
        del: jest.fn(),
        get: jest.fn(),
    },
}));


describe('Redis Service Test', ()=>{

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    let redisService:RedisService;
    const key = 'key';
    const value = 'value';

    beforeEach(async () => {
        redisService = new RedisService();
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });
    
    describe('deleteValue function test', ()=>{
        it('basic',  async () => {
            await redisService.deleteValue(key);
            expect(redisClient.del).toHaveBeenCalledWith(key);
        });
    });


    describe('setValue function test', ()=>{
        it('basic',  async () => {
          await redisService.setValue(key,value);
          expect(redisClient.set).toHaveBeenCalledWith(key,value);
        });
    });

    describe('getValue function test', ()=>{
        it('basic',  async () => {
            const getAsyncMock = jest.fn().mockResolvedValue(value);
            redisService['getAsync'] = getAsyncMock; 

            const result = await redisService.getValue(key);
            expect(result).toEqual(value);
            expect(getAsyncMock).toHaveBeenCalledWith(key);
        });
    });
});