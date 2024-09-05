
import { CalendarRepository } from '../../../src/repository/Calendar.Repository';
import { Calendar } from '../../../src/entity/Calendar';
import { mockDeep, mockReset} from 'jest-mock-extended';
import { Repository, SelectQueryBuilder, UpdateQueryBuilder } from 'typeorm';
import { CalendarInsert, CalendarInsertContent } from '../../../src/dto/request/CalendarInsert';
import { getPeriodValue } from '../../../src/util/enum/Period';


describe('Calendar Repository Test', ()=>{

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    let calendarRepository:CalendarRepository;
    const mockCalendarRepository = mockDeep<Repository<Calendar>>()

    beforeEach(async () => {
        mockReset(mockCalendarRepository);
        calendarRepository = new CalendarRepository();
        calendarRepository['save'] = mockCalendarRepository.save;
        calendarRepository['createQueryBuilder'] = mockCalendarRepository.createQueryBuilder;
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });
    
    describe('insertCalendarContents function test', ()=>{

        const mockCalendarContent1 = new CalendarInsertContent();
        const mockCalendarContent2 = new CalendarInsertContent();
        const calendarContents = new CalendarInsert();
        const userId = 1;

        it('basic', async ()=>{

            jest.spyOn(calendarContents, 'getCalendarContent').mockReturnValue([mockCalendarContent1, mockCalendarContent2]);

            jest.spyOn(mockCalendarContent1, 'getContent').mockReturnValue('content1');
            jest.spyOn(mockCalendarContent1, 'getPeriod').mockReturnValue('period1');
            jest.spyOn(mockCalendarContent1, 'getKind').mockReturnValue('kind1');
            jest.spyOn(mockCalendarContent1, 'getDate').mockReturnValue(new Date());
            
            jest.spyOn(mockCalendarContent2, 'getContent').mockReturnValue('content2');
            jest.spyOn(mockCalendarContent2, 'getPeriod').mockReturnValue('period2');
            jest.spyOn(mockCalendarContent2, 'getKind').mockReturnValue('kind2');
            jest.spyOn(mockCalendarContent2, 'getDate').mockReturnValue(new Date());

            const newCalendar1 = {} as Calendar;
            const newCalendar2 = {} as Calendar;

            jest.spyOn(Calendar, 'createCalendar').mockImplementation((content, period, kind, date, userId) => {
                if (userId === userId) {
                    if (content === 'content1') return newCalendar1;
                    if (content === 'content2') return newCalendar2;
                }
                return {} as Calendar;
            });

            await calendarRepository.insertCalendarContents(calendarContents, userId);

            expect(calendarContents.getCalendarContent).toHaveBeenCalled();
            expect(Calendar.createCalendar).toHaveBeenCalledTimes(2);
            expect(Calendar.createCalendar).toHaveBeenCalledWith('content1', getPeriodValue('period1'), 'kind1', expect.any(Date), userId);
            expect(Calendar.createCalendar).toHaveBeenCalledWith('content2', getPeriodValue('period2'), 'kind2', expect.any(Date), userId);
            expect(calendarRepository['save']).toHaveBeenCalledWith([newCalendar1, newCalendar2]);
        });
    });
});


