import {Period, getPeriodValue, getPeriodKey} from '../../../../src/util/enum/Period'



describe('Period Util Test', ()=>{


    describe('getPeriodValue function test', ()=>{

        it('basic', ()=>{
            const testCase1 =  { key: "매주", expectedValue: Period["매주"] };
            const testCase2 =  { key: "반복 안 함", expectedValue: Period["반복 안 함"] };
            const result1 = getPeriodValue(testCase1.key);
            const result2 = getPeriodValue(testCase2.key);
            expect(result1).toEqual(testCase1.expectedValue);
            expect(result2).toEqual(testCase2.expectedValue);
        });
    });


    describe('getPeriodKey function test', ()=>{

        it('basic', ()=>{
            expect(getPeriodKey(7)).toBe('매주');
            expect(getPeriodKey(0)).toBe('반복 안 함');
            expect(getPeriodKey(1)).toBe("매일");
            expect(getPeriodKey(14)).toBe("2주마다");
            expect(getPeriodKey(28)).toBe("4주마다");
        });

        it('return null ', () => {

            expect(getPeriodKey(30)).toBeNull();
            expect(getPeriodKey(-1)).toBeNull();
        });
    });


});