
import { CalendarService } from '../../../src/service/Calendar.Service';
import { CalendarInsert } from '../../../src/dto/request/CalendarInsert';
import { CalendarRepository } from '../../../src/repository/Calendar.Repository';


jest.mock('../../../src/repository/Calendar.Repository');

describe('Calendar Service Test', ()=>{

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    const calendarRepository = new CalendarRepository() as jest.Mocked<CalendarRepository>
    const calendarService = new CalendarService(calendarRepository);


    beforeEach(async () => {
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });
    


    describe('penetrateScheduleOrProductt function test', ()=>{

        const calendarContents = new CalendarInsert();
        const userId = 1;

        it('basic', async ()=>{

            const result = await calendarService.penetrateScheduleOrProduct(calendarContents, userId);
            expect(result).toEqual(undefined);
            
        });

    });
});


