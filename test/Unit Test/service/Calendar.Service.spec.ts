
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


jest.mock('../../../src/repository/Calendar.Repository');
jest.mock('../../../src/repository/User.Repository');
jest.mock('../../../src/util/verify', ()=>({
    verifyUser: jest.fn(),
    verifyCalendars: jest.fn()
}));
jest.mock('../../../src/util/enum/Period')

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

    describe('penetrateScheduleOrProduct function test', ()=>{

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


    describe('eraseScheduleOrProduct function test', ()=>{

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

    describe('bringScheduleOrProduct function test', ()=>{
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

    describe('mappingCalendarDatafunction test', ()=>{
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
    });






