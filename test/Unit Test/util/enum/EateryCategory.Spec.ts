import {EateryCategory, getProductCategoryByCondition} from '../../../../src/util/enum/EateryCategory';


describe('EateryCategory Util Test', ()=>{


    describe('getProductCategoryByCondition function test', ()=>{

        it('basic', ()=>{
            const testCase =  { key: "음식점", expectedValue: EateryCategory["음식점"] };
            const result = getProductCategoryByCondition(testCase.key);
            expect(result).toEqual(testCase.expectedValue);
        })
    })


})