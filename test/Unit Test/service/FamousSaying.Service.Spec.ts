import { FamousSaying } from '../../../src/dto/response/FamousSaying';
import {FamousSayingService} from '../../../src/service/FamousSaying.Service'
import { getFamousSayingRandomNumber, getFamousSaying, getWriter } from '../../../src/util/enum/FamousSaying';

jest.mock('../../../src/util/enum/FamousSaying')

describe('FamousSaying Test', ()=>{

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    let famousSayingService: FamousSayingService;
    const mockGetFamousSayingRandomNumber = getFamousSayingRandomNumber as jest.Mock;
    const mockGetFamousSaying = getFamousSaying as jest.Mock;
    const mockGetWriter = getWriter as jest.Mock;

    beforeEach(async () => {
        famousSayingService = new FamousSayingService();
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });
    
    describe('bringFamousSaying function test', ()=>{

        const bringFamousSayingResponse = FamousSaying.of('saying','writer');

        it('basic', async () => {

            mockGetFamousSayingRandomNumber.mockReturnValue(32);
            mockGetFamousSaying.mockReturnValue('saying')
            mockGetWriter.mockReturnValue('writer')
            const result = await famousSayingService.bringFamousSaying();
            expect(result).toEqual(bringFamousSayingResponse);
            expect(mockGetFamousSayingRandomNumber).toHaveBeenCalled(); 
            expect(mockGetFamousSaying).toHaveBeenCalledWith(32);
            expect(mockGetWriter).toHaveBeenCalledWith(32);
        });
    });
});