import { Request} from 'express';
import { SuccessResponseDto } from '../../../src/response/SuccessResponseDto';
import {FirebaseController} from '../../../src/controller/Firebase.Controller';
import { PushNoticeRequest } from '../../../src/dto/request/PushNoticeRequest';
import { pushNotice } from '../../../src/util/firebaseMessage';

jest.mock('../../../src/util/firebaseMessage');


describe('Firebase Controller Test', ()=>{

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });


    
    const firebaseController = new FirebaseController();

    beforeEach(async () => {
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });
    
    describe('executePushNotice function test', ()=>{

        const pushNoticeRequest = { getEngineValue:jest.fn().mockReturnValue('value')} as unknown as PushNoticeRequest;
        it('basic', async ()=>{

            const result = await firebaseController.executePushNotice(pushNoticeRequest);
            expect(result).toEqual(SuccessResponseDto.of(null));
            expect(pushNotice).toHaveBeenCalledWith(pushNoticeRequest.getEngineValue(), '알림 테스트', 'test');
        });

    });
});


