import {AlarmRepository} from '../../../src/repository/Alarm.Repository';
import { Connection } from 'typeorm';


describe('Calendar Repository Test', ()=>{

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    let alarmRepository:AlarmRepository;
    const connection = {
        query: jest.fn()
    }

    beforeEach(async () => {
        alarmRepository = new AlarmRepository(connection as unknown as Connection);
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });
    
    describe('findDataForAlarm function test', ()=>{


        it('basic', async ()=>{
            const data = [];
            (connection.query as jest.Mock).mockResolvedValue(data)
            const result = await alarmRepository.findDataForAlarm();
            expect(result).toEqual(data);
            expect(connection.query).toHaveBeenCalledWith(
                `
            SELECT *
            FROM user AS u
            INNER JOIN firebase_token AS ft ON ft.user_id = u.id 
            WHERE u.alarm = 1 AND CURRENT_TIME BETWEEN u.alarm_start AND u.alarm_end
            `
            );
    


        });
    });
});


