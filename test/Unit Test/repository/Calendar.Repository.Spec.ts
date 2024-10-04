
import { CalendarRepository } from '../../../src/repository/Calendar.Repository';
import { Calendar } from '../../../src/entity/Calendar';
import { mockDeep, mockReset} from 'jest-mock-extended';
import { Repository, SelectQueryBuilder, UpdateQueryBuilder, DeleteQueryBuilder } from 'typeorm';
import { CalendarInsert, CalendarInsertContent } from '../../../src/dto/request/CalendarInsert';
import { getPeriodValue } from '../../../src/util/enum/Period';



const calendar = {} as Calendar;
const calendars = [{ id: 1 } as unknown as Calendar, { id: 2 } as unknown as Calendar] as unknown as Calendar[]

const mockDeleteQueryBuilder = {
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ affected: 1 })
} as unknown as DeleteQueryBuilder<Calendar>;

const mockUpdateQueryBuilder = {
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    setParameters: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ affected: 1 })
} as unknown as UpdateQueryBuilder<Calendar>;

const mockSelectQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(calendar), 
    getMany: jest.fn().mockResolvedValue(calendars), 
} as unknown as SelectQueryBuilder<Calendar>;


describe('Calendar Repository Test', ()=>{

    let calendarRepository:CalendarRepository;
    const mockCalendarRepository = mockDeep<Repository<Calendar>>()

    beforeEach(async () => {
        mockReset(mockCalendarRepository);
        calendarRepository = new CalendarRepository();
        calendarRepository['save'] = mockCalendarRepository.save;
        calendarRepository['createQueryBuilder'] = mockCalendarRepository.createQueryBuilder;
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


    describe('findCalendarsByIdAndUserId function test', ()=>{
        it('basic', async ()=>{
            const calendarIds = [1,2];
            const userId = 1;
            mockCalendarRepository.createQueryBuilder.mockReturnValueOnce(mockSelectQueryBuilder);
            const result = await calendarRepository.findCalendarsByIdAndUserId(calendarIds, userId);
            expect(result).toEqual(calendars);  
            expect(calendarRepository['createQueryBuilder']).toHaveBeenCalled();
            expect(mockSelectQueryBuilder.select).toHaveBeenCalledWith('c');
            expect(mockSelectQueryBuilder.from).toHaveBeenCalledWith(Calendar, 'c');
            expect(mockSelectQueryBuilder.where).toHaveBeenCalledWith('c.id IN (:...calendarIds)', { calendarIds });
            expect(mockSelectQueryBuilder.andWhere).toHaveBeenCalledWith('c.user_id = :userId', { userId });
            expect(mockSelectQueryBuilder.getMany).toHaveBeenCalled();
        });
    });


    describe('findCalendarByIdAndUserId function test', ()=>{

        it('basic', async ()=> {
            const calendarId = 1;
            const userId = 1;
            mockCalendarRepository.createQueryBuilder.mockReturnValueOnce(mockSelectQueryBuilder);
            const result = await calendarRepository.findCalendarByIdAndUserId(calendarId, userId);
            expect(result).toEqual(calendar);  
            expect(calendarRepository['createQueryBuilder']).toHaveBeenCalled();
            expect(mockSelectQueryBuilder.select).toHaveBeenCalledWith('c');
            expect(mockSelectQueryBuilder.from).toHaveBeenCalledWith(Calendar, 'c');
            expect(mockSelectQueryBuilder.where).toHaveBeenCalledWith('c.id = :calendarId', { calendarId }); // 수정된 부분
            expect(mockSelectQueryBuilder.andWhere).toHaveBeenCalledWith('c.user_id = :userId', { userId });
            expect(mockSelectQueryBuilder.getOne).toHaveBeenCalled();
        });
    });


    describe('deleteCalendar function test', ()=>{
        it('basic', async ()=>{
            const calendarIds = [1,2];
            const userId = 1;
            mockCalendarRepository.createQueryBuilder.mockReturnValueOnce(mockDeleteQueryBuilder as unknown as SelectQueryBuilder<Calendar>);
            const result = await calendarRepository.deleteCalendar(calendarIds, userId);
            expect(result).toEqual({ affected: 1 });
            expect(calendarRepository['createQueryBuilder']).toHaveBeenCalled();
            expect(mockDeleteQueryBuilder.delete).toHaveBeenCalled();
            expect(mockDeleteQueryBuilder.from).toHaveBeenCalledWith(Calendar);
            expect(mockDeleteQueryBuilder.where).toHaveBeenCalledWith('id IN (:...calendarIds)', { calendarIds });
            expect(mockDeleteQueryBuilder.andWhere).toHaveBeenCalledWith('user_id = :userId', { userId });
            expect(mockDeleteQueryBuilder.execute).toHaveBeenCalled();
        });
    });

    describe('updateCalendar function test', ()=>{
        it('basic', async ()=>{
            await calendarRepository.updateCalendar(calendars);
            expect(calendarRepository['save']).toHaveBeenCalledWith(calendars)
        });
    });


    describe('findCalendarsByUserId function test', ()=>{
        it('basic', async ()=>{
            const userId = 1;
            mockCalendarRepository.createQueryBuilder.mockReturnValueOnce(mockSelectQueryBuilder);
            const result = await calendarRepository.findCalendarsByUserId(userId);
            expect(result).toEqual(calendars);
            expect(calendarRepository['createQueryBuilder']).toHaveBeenCalled();
            expect(mockSelectQueryBuilder.select).toHaveBeenCalledWith('c');
            expect(mockSelectQueryBuilder.from).toHaveBeenCalledWith(Calendar, 'c');
            expect(mockSelectQueryBuilder.where).toHaveBeenCalledWith('c.user_id = :userId',{userId});
            expect(mockSelectQueryBuilder.getMany).toHaveBeenCalled();
        });
    });







});


