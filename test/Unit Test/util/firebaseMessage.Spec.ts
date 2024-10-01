import { pushNotice } from '../../../src/util/firebaseMessage';
import { firebase } from '../../../src/config/firebase'; 


jest.mock('../../../src/config/firebase', () => {
    const send = jest.fn().mockResolvedValue('Successfully sent message');
    return {
        firebase: {
            messaging: jest.fn().mockReturnValue({
                send,
            }),
        },
    };
});

describe('firebaseMessage Util Test', () => {
    describe('pushNotice function test', () => {
        it('notification and log success', async () => {
            const engineValue = 'engineValue';
            const title = 'title';
            const body = 'body';
            const sendSpy = jest.spyOn(firebase.messaging(), 'send');
            const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            await pushNotice(engineValue, title, body);
            expect(sendSpy).toHaveBeenCalledWith({
                token: engineValue,
                notification: {
                    title: title,
                    body: body,
                },
            });
            expect(logSpy).toHaveBeenCalledWith('Successfully sent message:', 'Successfully sent message');
            sendSpy.mockRestore();  // 스파이 제거
            logSpy.mockRestore();
        });
    });
});
