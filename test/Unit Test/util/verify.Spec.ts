import { verifyUser,  verifyEateryCategory, verifyCalendar, verifyCalendars, verifyarrivalList, verifyCoordinates } from "../../../src/util/verify";
import { checkData } from "../../../src/util/checker";
import { User } from "../../../src/entity/User";
import { ErrorCode } from "../../../src/exception/ErrorCode";
import { ErrorResponseDto } from "../../../src/response/ErrorResponseDto";
import { Calendar } from "../../../src/entity/Calendar";

jest.mock('../../../src/util/checker')


describe('Verify Util Test', ()=>{

    const mockCheckData = checkData as jest.Mock;

    beforeEach(async () => {
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });
    

    describe('verifyUser function test', ()=>{

        const data = {} as User;

        it('basic', ()=>{
            mockCheckData.mockReturnValue(true);
            const result = verifyUser(data);
            expect(result).toBeUndefined();
        });

        it('data undefined', ()=>{
            mockCheckData.mockReturnValue(false);
            expect(() => verifyUser(data)).toThrow();
            expect(mockCheckData).toHaveBeenCalledWith(data);
            expect(mockCheckData).toHaveBeenCalledTimes(1);
        });
    });

    describe('verifyEateryCategory function test', ()=>{

        const data = 'data';

        it('basic', ()=>{
            mockCheckData.mockReturnValue(true);
            const result = verifyEateryCategory(data);
            expect(result).toBeUndefined();
 
        });

        it('data undefined', ()=>{
            mockCheckData.mockReturnValue(false);
            expect(() => verifyEateryCategory(data)).toThrow();
            expect(mockCheckData).toHaveBeenCalledWith(data);
            expect(mockCheckData).toHaveBeenCalledTimes(1);
  
        });
    });


    describe('verifyCalendar function test', ()=>{

        const data = {} as Calendar;

        it('basic', ()=>{
            mockCheckData.mockReturnValue(true);
            const result = verifyCalendar(data);
            expect(result).toBeUndefined();
 
        });

        it('data undefined', ()=>{
            mockCheckData.mockReturnValue(false);
            expect(() => verifyCalendar(data)).toThrow();
            expect(mockCheckData).toHaveBeenCalledWith(data);
            expect(mockCheckData).toHaveBeenCalledTimes(1);
  
        });
    });


    describe('verifyCalendars function test', ()=>{
        const length = 3
        it('basic', ()=>{
            const data = [{},{},{}] as Calendar[];
            const result = verifyCalendars(data, length);
            expect(result).toBeUndefined();
        });
        it('data undefined', ()=>{
            const data = [{},{}] as Calendar[];
            expect(() => verifyCalendars(data, length)).toThrow();
        });
    });

    describe('verifyarrivalList function test', ()=>{

        const data = 'data';

        it('basic', ()=>{
            mockCheckData.mockReturnValue(true);
            const result =  verifyarrivalList(data);
            expect(result).toBeUndefined();
 
        });

        it('data undefined', ()=>{
            mockCheckData.mockReturnValue(false);
            expect(() =>  verifyarrivalList(data)).toThrow();
            expect(mockCheckData).toHaveBeenCalledWith(data);
            expect(mockCheckData).toHaveBeenCalledTimes(1);
  
        });
    });

    describe('verifyCoordinates function test', ()=>{

        const data = 'data';

        it('basic', ()=>{
            mockCheckData.mockReturnValue(true);
            const result = verifyCoordinates(data);
            expect(result).toBeUndefined();
 
        });

        it('data undefined', ()=>{
            mockCheckData.mockReturnValue(false);
            expect(() => verifyCoordinates(data)).toThrow();
            expect(mockCheckData).toHaveBeenCalledWith(data);
            expect(mockCheckData).toHaveBeenCalledTimes(1);
  
        });
    });

});