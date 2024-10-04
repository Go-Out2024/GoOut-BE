
import {CalendarController} from '../../../src/controller/Calendar.Controller'
import { CalendarService } from '../../../src/service/Calendar.Service';
import { CalendarInsert } from '../../../src/dto/request/CalendarInsert';
import { Request} from 'express';
import { SuccessResponseDto } from '../../../src/response/SuccessResponseDto';
import { CalendarErase } from '../../../src/dto/request/CalendarErase';
import { CalendarData, CalendarDatas } from '../../../src/dto/response/CalendarData';
import { CalendarUpdate } from '../../../src/dto/request/CalendarUpdate';
import { CalendarDataCheck } from '../../../src/dto/response/CalendarDataCheck';



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
    const req = {decoded:{id:1}} as Request;

    beforeEach(async () => {
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });
    


    describe('penetrateScheduleOrProduct function test', ()=>{

        it('basic', async ()=>{

            const calendarContents = new CalendarInsert();
            calendarContents.getCalendarContent = jest.fn().mockReturnValue({} as any);

            const result = await calendarController.penetrateScheduleOrProduct(calendarContents, req);
            expect(result).toEqual(SuccessResponseDto.of());
            expect(calendarService.penetrateScheduleOrProduct).toHaveBeenCalledWith(calendarContents, req.decoded.id);
        });
    });


    describe('eraseScheduleOrProduct function test', ()=>{

        it('basic', async ()=>{
            const calendarErase = {getCalendarIds:jest.fn().mockReturnValue(1)} as unknown as CalendarErase;
            const result = await calendarController.eraseScheduleOrProduct(calendarErase, req);
            expect(result).toEqual(SuccessResponseDto.of());
            expect(calendarService.eraseScheduleOrProduct).toHaveBeenCalledWith(req.decoded.id, calendarErase.getCalendarIds());
        });
    });

    describe('bringScheduleOrProduct function test', ()=>{
        const date = 'date';
        const calendarDatas = CalendarDatas.of({} as unknown as CalendarData[]);
        it('basic', async ()=>{

            calendarService.bringScheduleOrProduct.mockResolvedValue(calendarDatas);
            const result = await calendarController.bringScheduleOrProduct(date, req);
            expect(result).toEqual(SuccessResponseDto.of(calendarDatas));
            expect(calendarService.bringScheduleOrProduct).toHaveBeenCalledWith(req.decoded.id,date);
        });
    });


    describe('modifyScheduleOrProduct function test', ()=>{
        const calendarUpdate = {} as CalendarUpdate;
    
        it('basic', async ()=>{
            const result = await calendarController.modifyScheduleOrProduct(calendarUpdate, req);
            expect(result).toEqual(SuccessResponseDto.of());
            expect(calendarService.modifyScheduleOrProduct).toHaveBeenCalledWith(calendarUpdate, req.decoded.id);
        });
    });


    describe('bringScheduleOrProductChecking function test', ()=>{
        const month = 'month';
    
        it('basic', async ()=>{
            const bringScheduleOrProductCheckingResponse = CalendarDataCheck.of({} as any[]);
            calendarService.bringScheduleOrProductChecking.mockResolvedValue(bringScheduleOrProductCheckingResponse);
            const result = await calendarController.bringScheduleOrProductChecking(month, req);
            expect(result).toEqual(SuccessResponseDto.of(bringScheduleOrProductCheckingResponse));
            expect(calendarService.bringScheduleOrProductChecking).toHaveBeenCalledWith(req.decoded.id, month);
        });
    });





});


