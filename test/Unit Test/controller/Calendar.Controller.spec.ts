
import {CalendarController} from '../../../src/controller/Calendar.Controller'
import { CalendarService } from '../../../src/service/Calendar.Service';
import { CalendarInsert } from '../../../src/dto/request/CalendarInsert';
import { Request} from 'express';
import { SuccessResponseDto } from '../../../src/response/SuccessResponseDto';



declare module 'express-serve-static-core' {
    interface Request {
        decoded: { id: number };
    }
}

jest.mock('../../../src/service/Calendar.Service');

describe('Calendar Controller Test', ()=>{

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    const calendarService = new CalendarService({} as any, {} as any)as jest.Mocked<CalendarService>;
    const calendarController = new CalendarController(calendarService);

    beforeEach(async () => {
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });
    


    describe('penetrateScheduleOrProduct function test', ()=>{

        it('basic', async ()=>{

            const req = {decoded:{id:1}} as Request;
            const calendarContents = new CalendarInsert();
            calendarContents.getCalendarContent = jest.fn().mockReturnValue({} as any);

            const result = await calendarController.penetrateScheduleOrProduct(calendarContents, req);
            expect(result).toEqual(SuccessResponseDto.of());
            expect(calendarService.penetrateScheduleOrProduct).toHaveBeenCalledWith(calendarContents, req.decoded.id);
        });

    });
});


