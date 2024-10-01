
import { CalendarService } from '../../../src/service/Calendar.Service';
import { CalendarInsert } from '../../../src/dto/request/CalendarInsert';
import { CalendarRepository } from '../../../src/repository/Calendar.Repository';
import { UserRepository} from '../../../src/repository/User.Repository';
import { User } from '../../../src/entity/User';
import { verifyUser, verifyCalendars } from '../../../src/util/verify';
import { ErrorCode } from '../../../src/exception/ErrorCode';
import { ErrorResponseDto } from '../../../src/response/ErrorResponseDto';
import { Calendar } from '../../../src/entity/Calendar';
import { CalendarData, CalendarDatas } from '../../../src/dto/response/CalendarData';
import { getPeriodKey } from '../../../src/util/enum/Period';
import { isSameDay } from '../../../src/util/checker';
import { CalendarUpdate, CalendarUpdateContent } from '../../../src/dto/request/CalendarUpdate';
import { CalendarDataCheck } from '../../../src/dto/response/CalendarDataCheck';


jest.mock('../../../src/repository/Calendar.Repository');
jest.mock('../../../src/repository/User.Repository');
jest.mock('../../../src/util/verify', ()=>({
    verifyUser: jest.fn(),
    verifyCalendars: jest.fn()
}));
jest.mock('../../../src/util/enum/Period')
jest.mock('../../../src/util/checker')

describe('Calendar Service Test', ()=>{

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    const calendarRepository = new CalendarRepository() as jest.Mocked<CalendarRepository>;
    const userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    let calendarService:CalendarService;
    const mockVerifyCalendars = verifyCalendars as jest.Mock;
    const calendars = {} as Calendar[]

    beforeEach(async () => {
        calendarService = new CalendarService(calendarRepository, userRepository);
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });

    const userId = 1;

    describe('penetrateScheduleOrProduct Function Test', ()=>{

        const calendarContents = new CalendarInsert();
        const user = {} as User;
        const mockVerifyUser = verifyUser as jest.Mock;

        it('basic', async ()=>{

            userRepository.findUserById.mockResolvedValue(user);
            const result = await calendarService.penetrateScheduleOrProduct(calendarContents, userId);
            expect(result).toEqual(undefined);
            expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
            expect(mockVerifyUser).toHaveBeenCalledWith(user);
            
        });

        it('verify error', async ()=>{
            userRepository.findUserById.mockResolvedValue(undefined);
            mockVerifyUser.mockImplementation(()=>{
                throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_USER)
            })
            await expect(calendarService.penetrateScheduleOrProduct(calendarContents, userId))
            .rejects
            .toEqual(ErrorResponseDto.of(ErrorCode.NOT_FOUND_USER));
            expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
            expect(mockVerifyUser).toHaveBeenCalledWith(undefined);
        });
    });


    describe('eraseScheduleOrProduct Function Test', ()=>{

        const userId = 1;
        const calendarIds = [1,2,3];
 

        it('basic', async ()=>{

            calendarRepository.findCalendarsByIdAndUserId.mockResolvedValue(calendars);
            const result = await calendarService.eraseScheduleOrProduct(userId,calendarIds);
            expect(result).toEqual(undefined);
            expect(calendarRepository.findCalendarsByIdAndUserId).toHaveBeenCalledWith(calendarIds,userId);
            expect(mockVerifyCalendars).toHaveBeenCalledWith(calendars,3);
            
        });

        it('verifyCalendars error', async ()=>{
            calendarRepository.findCalendarsByIdAndUserId.mockResolvedValue(undefined);
            mockVerifyCalendars.mockImplementation(()=>{
                throw ErrorResponseDto.of(ErrorCode.NOT_FOUNT_CALENDAR)
            })
            await expect(calendarService.eraseScheduleOrProduct(userId,calendarIds))
            .rejects
            .toEqual(ErrorResponseDto.of(ErrorCode.NOT_FOUNT_CALENDAR));
            expect(calendarRepository.findCalendarsByIdAndUserId).toHaveBeenCalledWith(calendarIds, userId);
            expect(mockVerifyCalendars).toHaveBeenCalledWith(undefined, 3);
        });
    });

    describe('bringScheduleOrProduct Function Test', ()=>{
        const date = "date";
        const calendarData = {} as CalendarData[]
        const bringScheduleOrProductResponse = CalendarDatas.of(calendarData)

        it('basic', async ()=>{
            calendarRepository.findCalendarsByUserId.mockResolvedValue(calendars);
            const filteredCalendars = jest.spyOn(calendarService, 'filterCalendarsByPeriodMultiple').mockReturnValue(calendars);
            const mappedCalendarData = jest.spyOn(calendarService, 'mappingCalendarData').mockReturnValue(calendarData);
            const result = await calendarService.bringScheduleOrProduct(userId,date);
            expect(result).toEqual(bringScheduleOrProductResponse);
            expect(filteredCalendars).toHaveBeenCalledWith(calendars,date);
            expect(mappedCalendarData).toHaveBeenCalledWith(calendarData);         
        });
    });

    describe('mappingCalendarDatafunction Function Test', ()=>{
        it('basic', async ()=>{
            const calendars: Calendar[] = [
                { getId: jest.fn().mockReturnValue(1), getContent: jest.fn().mockReturnValue('Content 1'), getKind: jest.fn().mockReturnValue('Kind 1'), getPeriod: jest.fn().mockReturnValue('Period 1') },
                { getId: jest.fn().mockReturnValue(2), getContent: jest.fn().mockReturnValue('Content 2'), getKind: jest.fn().mockReturnValue('Kind 2'), getPeriod: jest.fn().mockReturnValue('Period 2') },
            ] as unknown as Calendar[];
    
            const expectedData = [
                CalendarData.of(1, 'Content 1', 'Kind 1', 'Key for Period 1'),
                CalendarData.of(2, 'Content 2', 'Kind 2', 'Key for Period 2'),
            ];

            (getPeriodKey as jest.Mock).mockImplementation((period: string) => `Key for ${period}`);
            const result = calendarService.mappingCalendarData(calendars);
            expect(result).toEqual(expectedData);
            expect(getPeriodKey).toHaveBeenCalledWith('Period 1');
            expect(getPeriodKey).toHaveBeenCalledWith('Period 2');
        });  
    });

    describe('filterCalendarsByPeriodMultiple Function Test', ()=>{
        const mockIsSameDay = isSameDay as jest.Mock;
        it('isSameDay return', async ()=>{
            const mockCalendar = { 
                getDate: jest.fn().mockReturnValue('2024-09-10'), 
                getPeriod: jest.fn().mockReturnValue(0) 
            } as unknown as Calendar;
            const calendars = [mockCalendar];
            const date = '2024-09-10';
            mockIsSameDay.mockReturnValue(true);
            const result = calendarService.filterCalendarsByPeriodMultiple(calendars, date);
            expect(result).toEqual([mockCalendar]); 
            expect(mockIsSameDay).toHaveBeenCalledWith(new Date('2024-09-10'), new Date(date));  
        });

        it('MultipleOfPeriod return', async ()=>{
            const mockCalendar = { 
                getDate: jest.fn().mockReturnValue('2024-09-10'), 
                getPeriod: jest.fn().mockReturnValue(2) 
            } as unknown as Calendar;
            const calendars = [mockCalendar];
            const date = '2024-09-10';
            const isMultipleOfPeriodSpyOn = jest.spyOn(calendarService as any, 'isMultipleOfPeriod').mockReturnValue(true);
            const result = calendarService.filterCalendarsByPeriodMultiple(calendars, date);
            expect(result).toEqual([mockCalendar]);  
            expect(isMultipleOfPeriodSpyOn).toHaveBeenCalledWith(new Date('2024-09-10'), new Date(date),2);  
        });
    });  


    describe('isMultipleOfPeriod Function Test', ()=>{

        it('same period and date', () => {
            const startDate = new Date('2024-09-01');
            const targetDate = new Date('2024-09-08'); 
            const period = 7;
        
            const result = calendarService['isMultipleOfPeriod'](startDate, targetDate, period);
    
            expect(result).toBe(true);
        });
        
        it('not same period and date', () => {
            const startDate = new Date('2024-09-01');
            const targetDate = new Date('2024-09-06'); 
            const period = 7;
        
            const result = calendarService['isMultipleOfPeriod'](startDate, targetDate, period);
        
            expect(result).toBe(false);
        });
        
        it('before startDate', () => {
            const startDate = new Date('2024-09-01');
            const targetDate = new Date('2024-08-25');
            const period = 7;
        
            const result = calendarService['isMultipleOfPeriod'](startDate, targetDate, period);
        
            expect(result).toBe(false);
        });
    });  


    describe('modifyScheduleOrProduct Function Test', ()=>{
        const calendarIds = [1,2,3];
        const calendarDatas = {} as unknown as Calendar[];
        const userId = 1;

        it('basic', async () => {
            const calendarUpdate = {getCalendarContent:jest.fn().mockReturnValue([{},{}])} as unknown as CalendarUpdate;

            const extractCalendarIdSpyOn = jest.spyOn(calendarService as any, 'extractCalendarId').mockReturnValue(calendarIds);
            calendarRepository.findCalendarsByIdAndUserId.mockResolvedValue(calendarDatas);
            const mappedCalendarUpdateStatusSpyOn = jest.spyOn(calendarService as any, 'mappingCalendarUpdateStatus').mockReturnValue(calendarDatas);
            await calendarService.modifyScheduleOrProduct(calendarUpdate,userId);
            expect(extractCalendarIdSpyOn).toHaveBeenCalledWith(calendarUpdate);
            expect(calendarRepository.findCalendarsByIdAndUserId).toHaveBeenCalledWith(calendarIds, userId);
            expect(verifyCalendars).toHaveBeenCalledWith(calendarDatas,calendarUpdate.getCalendarContent().length);
            expect(mappedCalendarUpdateStatusSpyOn).toHaveBeenCalledWith(calendarUpdate, userId);
            expect(calendarRepository.updateCalendar).toHaveBeenCalledWith(calendarDatas);
        });
        
        it('verifyCalendars Error', async () => {
            const calendarUpdate = {getCalendarContent:jest.fn().mockReturnValue([{},{}])} as unknown as CalendarUpdate;

            const extractCalendarIdSpyOn = jest.spyOn(calendarService as any, 'extractCalendarId').mockReturnValue(calendarIds);
            calendarRepository.findCalendarsByIdAndUserId.mockResolvedValue(undefined);
            mockVerifyCalendars.mockImplementation(()=>{
                throw ErrorResponseDto.of(ErrorCode.NOT_FOUNT_CALENDAR)
            })
            const mappedCalendarUpdateStatusSpyOn = jest.spyOn(calendarService as any, 'mappingCalendarUpdateStatus').mockReturnValue(calendarDatas);
            await expect(calendarService.modifyScheduleOrProduct(calendarUpdate,userId))
            .rejects
            .toEqual(ErrorResponseDto.of(ErrorCode.NOT_FOUNT_CALENDAR));

            expect(extractCalendarIdSpyOn).toHaveBeenCalledWith(calendarUpdate);
            expect(calendarRepository.findCalendarsByIdAndUserId).toHaveBeenCalledWith(calendarIds, userId);
            expect(verifyCalendars).toHaveBeenCalledWith(undefined,calendarUpdate.getCalendarContent().length);
            expect(mappedCalendarUpdateStatusSpyOn).not.toHaveBeenCalledWith(calendarUpdate, userId);
            expect(calendarRepository.updateCalendar).not.toHaveBeenCalledWith(calendarDatas);
        });
    });  

    describe('mappingCalendarUpdateStatus Function Test', ()=>{

        it('basic', async () => {
            const calendarUpdateContent = {
                getCalendarId: jest.fn().mockReturnValue(1),
                getContent: jest.fn().mockReturnValue('Test Content'),
                getPeriod: jest.fn().mockReturnValue(7),
            } as unknown as CalendarUpdateContent;
            const calendarUpdate = {
                getCalendarContent: jest.fn().mockReturnValue([calendarUpdateContent])
            } as unknown as CalendarUpdate;
            const userId = 3;
            const calendars = [Calendar.createCalendarUpdate(1,'Test Content',7, userId)]

            const createCalendarUpdateSpy = jest.spyOn(Calendar, 'createCalendarUpdate');
            const result = calendarService['mappingCalendarUpdateStatus'](calendarUpdate, userId);
            expect(calendarUpdate.getCalendarContent).toHaveBeenCalled();
            expect(calendarUpdateContent.getCalendarId).toHaveBeenCalled();
            expect(calendarUpdateContent.getContent).toHaveBeenCalled();
            expect(calendarUpdateContent.getPeriod).toHaveBeenCalled();
            expect(createCalendarUpdateSpy).toHaveBeenCalledWith(1, 'Test Content', 7, userId);
            expect(result).toEqual(calendars);

        });
    });  


    describe('extractCalendarId Function Test', ()=>{
        it('basic', async () => {
            const calendarUpdateContent = {
                getCalendarId: jest.fn().mockReturnValue(1),
                getContent: jest.fn().mockReturnValue('Test Content'),
                getPeriod: jest.fn().mockReturnValue(7),
            } as unknown as CalendarUpdateContent;
            const calendarUpdate = {
                getCalendarContent: jest.fn().mockReturnValue([calendarUpdateContent])
            } as unknown as CalendarUpdate;
            const numbers = [1];

            const result = calendarService['extractCalendarId'](calendarUpdate);
            expect(result).toEqual(numbers);
        });
    });  


    describe('bringScheduleOrProductChecking Function Test', ()=>{
        const userId = 3;
        const month = '2024-03';
        const dates = [new Date('2024-03-21'), new Date('2024-03-02')]
        const calendars = {} as Calendar[];
        const bringScheduleOrProductCheckingResponse = CalendarDataCheck.of(dates);
        it('basic', async () => {
            calendarRepository.findCalendarsByUserId.mockResolvedValue(calendars);
            const extractCalendarCheckingSpy = jest.spyOn(calendarService, 'extractCalendarChecking').mockReturnValue(dates);
            const result = await calendarService.bringScheduleOrProductChecking(userId, month);
            expect(extractCalendarCheckingSpy).toHaveBeenCalledWith(calendars, month);
            expect(calendarRepository.findCalendarsByUserId).toHaveBeenCalledWith(userId);
            expect(result).toEqual(bringScheduleOrProductCheckingResponse);
        });
    }); 

    describe('extractCalendarChecking Function Test', ()=>{
        const month = '2024-03';
        const monthStartDate = new Date('2024-03-01');
        const monthEndDate = new Date('2024-03-31');
        const uniqueDates = new Set<number>([new Date('2024-03-21').getTime(), new Date('2024-03-02').getTime()]);
        const expectedDates = [new Date('2024-03-02'), new Date('2024-03-21')]; // 정렬된 날짜 리스트
        const calendars = {} as Calendar[];
        it('basic', async () => {
            const getMonthEndDateSpy = jest.spyOn(calendarService as any, 'getMonthEndDate').mockReturnValue([monthStartDate, monthEndDate]);
            const extractDatesSpy = jest.spyOn(calendarService as any, 'extractDates').mockReturnValue(uniqueDates);
            const result = calendarService.extractCalendarChecking(calendars, month);
            expect(getMonthEndDateSpy).toHaveBeenCalledWith(month);
            expect(extractDatesSpy).toHaveBeenCalledWith(calendars, monthStartDate, monthEndDate);
            expect(result).toEqual(expectedDates);
        });
    }); 

    describe('extractDates Function Test', ()=>{
        const calendar = {} as Calendar;  
        const calendars = [calendar] as Calendar[]; 
        const monthStartDate = new Date('2024-03-01');
        const monthEndDate = new Date('2024-03-31');
        const uniqueDates = new Set<number>();

        it('basic', async () => {
            const processCalendarDatesSpy = jest.spyOn(calendarService as any, 'processCalendarDates').mockReturnValue(uniqueDates)
            const result = calendarService.extractDates(calendars, monthStartDate, monthEndDate);
            expect(processCalendarDatesSpy).toHaveBeenCalledWith(calendar, monthStartDate, monthEndDate, expect.any(Set));
            expect(result).toEqual(uniqueDates);
        });
    }); 


    describe('processCalendarDates Function Test', ()=>{
      
        const monthStartDate = new Date('2024-03-01');
        const monthEndDate = new Date('2024-03-31');
        const uniqueDates = new Set<number>();
        const frequencyInMs = 12_000;
     
        it('execute addSingleDateIfWithinRange', async () => {
            const getFrequencyInMsSpy = jest.spyOn(calendarService as any, 'getFrequencyInMs').mockReturnValue(frequencyInMs);
            const calendar = {getDate:jest.fn().mockReturnValue('2024-03-12'), getPeriod:jest.fn().mockReturnValue(0)} as unknown as Calendar;  
            const addSingleDateIfWithinRangeSpy = jest.spyOn(calendarService as any, 'addSingleDateIfWithinRange').mockReturnValue(null);
            const result = calendarService['processCalendarDates'](calendar,monthStartDate,monthEndDate,uniqueDates);
            expect(getFrequencyInMsSpy).toHaveBeenCalledWith(calendar);
            expect(addSingleDateIfWithinRangeSpy).toHaveBeenCalledWith(new Date(calendar.getDate()),monthStartDate,monthEndDate,uniqueDates);
            expect(result).toEqual(undefined);
        });

        it('execute addRecurringDates', async () => {
            const getFrequencyInMsSpy = jest.spyOn(calendarService as any, 'getFrequencyInMs').mockReturnValue(frequencyInMs);
            const calendar = {getDate:jest.fn().mockReturnValue('2024-03-12'), getPeriod:jest.fn().mockReturnValue(2)} as unknown as Calendar;  
            const addRecurringDatesSpy = jest.spyOn(calendarService as any, 'addRecurringDates').mockReturnValue(null);
            const result = calendarService['processCalendarDates'](calendar,monthStartDate,monthEndDate,uniqueDates);
            expect(getFrequencyInMsSpy).toHaveBeenCalledWith(calendar);
            expect(addRecurringDatesSpy).toHaveBeenCalledWith(new Date(calendar.getDate()),frequencyInMs, monthStartDate,monthEndDate,uniqueDates);
            expect(result).toEqual(undefined);
        });
    }); 


    describe('getFrequencyInMs Function Test', ()=>{
        it('basic', async () => {
            const calendar = {getPeriod:jest.fn().mockReturnValue(12_000)} as unknown as Calendar;
            const result = calendarService['getFrequencyInMs'](calendar);
            expect(result).toEqual(12_000 * 24 * 60 * 60 * 1000);
        });
    }); 

    describe('addSingleDateIfWithinRange Function Test', ()=>{
        const monthStartDate = new Date('2024-03-01');
        const monthEndDate = new Date('2024-03-31');
        const uniqueDates = new Set<number>();

        it('between date', async () => {
            const currentDate = new Date('2024-03-15');
            const result = calendarService['addSingleDateIfWithinRange'](currentDate,monthStartDate,monthEndDate,uniqueDates);
            expect(result).toEqual(undefined)
        });

        it('not between date', async () => {
            const currentDate = new Date('2024-04-15');
            const result = calendarService['addSingleDateIfWithinRange'](currentDate,monthStartDate,monthEndDate,uniqueDates);
            expect(result).toEqual(undefined)
        });
    }); 

    describe('addRecurringDates Function Test', ()=>{
        const monthStartDate = new Date('2024-03-01');
        const monthEndDate = new Date('2024-03-31');
        const uniqueDates = new Set<number>();
        const frequencyInMs = 12_000;
        it('between date', async () => {
            const currentDate = new Date('2024-03-15');
            const result = calendarService['addRecurringDates'](currentDate,frequencyInMs,monthStartDate,monthEndDate,uniqueDates);
            expect(result).toEqual(undefined);
        });

        it('not between date', async () => {
            const currentDate = new Date('2024-05-15');
            const result = calendarService['addRecurringDates'](currentDate,frequencyInMs,monthStartDate,monthEndDate,uniqueDates);
            expect(result).toEqual(undefined);
        });
    }); 

    describe('getMonthEndDate Function Test', ()=>{
        const month = '2024-09';
        const expectedStartDate = new Date(Date.UTC(2024, 8, 1));
        const expectedEndDate = new Date(Date.UTC(2024, 8, 30)); 
        it('basic', async () => {
            const [startDate, endDate] = calendarService['getMonthEndDate'](month);
            expect(startDate).toEqual(expectedStartDate);
            expect(endDate).toEqual(expectedEndDate);
            
        });
    }); 
});












