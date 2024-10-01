import {checkData, isSameDay} from '../../../src/util/checker';

describe('Checker Util Test', ()=>{

    describe('checkData function test', ()=>{

        it('basic', ()=>{
            const data = "data";
            const result = checkData(data);
            expect(result).toBe(true);
        });

        it('data undefined', ()=>{
            const data = undefined;
            const result = checkData(data);
            expect(result).toBe(false);
        });
    });

    describe('isSameDay function test', ()=>{

        it('basic', ()=>{
            const relativeDate = new Date('2024-09-18T00:00:00Z');
            const targetDate = new Date('2024-09-18T00:00:00Z');
            const result = isSameDay(relativeDate, targetDate);
            expect(result).toBe(true);
        });

        it('not same', ()=>{
            const relativeDate = new Date('2024-09-18T12:00:00Z');
            const targetDate = new Date('2024-09-18T00:00:00Z');
            const result = isSameDay(relativeDate, targetDate);
            expect(result).toBe(false);
        });
    });
});