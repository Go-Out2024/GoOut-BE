import { Request} from 'express';
import { SuccessResponseDto } from '../../../src/response/SuccessResponseDto';
import {FamousSayingService} from '../../../src/service/FamousSaying.Service';
import {FamousSayingController} from '../../../src/controller/FamousSaying.Controller';
import { FamousSaying } from '../../../src/dto/response/FamousSaying';


jest.mock('../../../src/service/FamousSaying.Service');

describe('FamousSaying Controller Test', ()=>{

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });


    const famousSayingService = new FamousSayingService() as jest.Mocked<FamousSayingService>;
    const famousSayingController = new FamousSayingController(famousSayingService);

    beforeEach(async () => {
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });
    
    describe('bringFamousSaying function test', ()=>{

        it('basic', async ()=>{
            const bringFamousSayingResponse = FamousSaying.of({} as any, {} as any);
            famousSayingService.bringFamousSaying.mockResolvedValue(bringFamousSayingResponse);
            const result = await famousSayingController.bringFamousSaying();
            expect(result).toEqual(SuccessResponseDto.of(bringFamousSayingResponse));
            expect(famousSayingService.bringFamousSaying).toHaveBeenCalled();
        });

    });
});


