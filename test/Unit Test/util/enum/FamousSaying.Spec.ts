import {FamousSaying, getFamousSaying, getFamousSayingRandomNumber, getWriter} from '../../../../src/util/enum/FamousSaying'

describe('FamousSaying Util Test', ()=>{


    describe('getFamousSaying function test', ()=>{

        it('basic', () => {
            expect(getFamousSaying(FamousSaying["삶이 있는 한 희망은 있다"])).toBe("삶이 있는 한 희망은 있다");
            expect(getFamousSaying(FamousSaying["산다는것 그것은 치열한 전투이다"])).toBe("산다는것 그것은 치열한 전투이다");
            expect(getFamousSaying(FamousSaying["하루에 3시간을 걸으면 7년 후에 지구를 한바퀴 돌 수 있다"])).toBe("하루에 3시간을 걸으면 7년 후에 지구를 한바퀴 돌 수 있다");
            expect(getFamousSaying(FamousSaying["언제나 현재에 집중할 수 있다면 행복할 것이다"])).toBe("언제나 현재에 집중할 수 있다면 행복할 것이다");
            expect(getFamousSaying(FamousSaying["진정으로 웃으려면 고통을 참아야하며 나아가 고통을 즐길 줄 알아야 해"])).toBe("진정으로 웃으려면 고통을 참아야하며 나아가 고통을 즐길 줄 알아야 해");
        });
        
          it('should return undefined for invalid values', () => {
            expect(getFamousSaying(100)).toBeUndefined(); // 100은 유효하지 않은 값이므로 undefined를 반환해야 합니다.
        });
    });

    describe('getFamousSayingRandomNumber function test', ()=>{

        it('basic', () => {
            const randomNum = getFamousSayingRandomNumber();
            expect(randomNum).toBeGreaterThanOrEqual(0);
            expect(randomNum).toBeLessThanOrEqual(99);
        });
    });

    describe('getWriter function test', ()=>{

        it('basic', () => {
            expect(getWriter(0)).toBe('키케로');
            expect(getWriter(1)).toBe('로망 로랑');
            expect(getWriter(99)).toBe('조 지라드');
          });
        
        it('should return the default error message for an invalid code', () => {
            expect(getWriter(100)).toBe('알 수 없는 오류가 발생하였습니다.');
            expect(getWriter(-1)).toBe('알 수 없는 오류가 발생하였습니다.');
        });
    });


})