import schedule from 'node-schedule';
import { YouTubeSchedule } from '../../../src/util/YouTubeSchedule';
import { RedisService } from "../../../src/service/Redis.Service";
import { YouTubeApi } from "../../../src/util/YouTubeApi";
import { AlarmRepository } from '../../../src/repository/Alarm.Repository';
import { Alarm } from '../../../src/util/Alarm';
import { Container } from 'typedi';
import {settingRecommendMusic,handleAlarm }   from '../../../src/util/scheduler';

jest.mock('node-schedule');
jest.mock('../../../src/util/YouTubeSchedule');
jest.mock('../../../src/service/Redis.Service');
jest.mock('../../../src/util/YouTubeApi');
jest.mock('../../../src/repository/Alarm.Repository');

describe('scheduler Util Test', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        Container.set(RedisService, new RedisService());
        Container.set(YouTubeApi, new YouTubeApi());
        Container.set(AlarmRepository, {
            findDataForAlarm: jest.fn().mockResolvedValue([{ user_id: 1, token: 'test-token' }])
        });
        Container.set(Alarm, {
            handleAlarm: jest.fn()
        });
    });

    describe('settingRecommendMusic function test', () => {
        it('should schedule the YouTube music recommendation', async () => {
            const scheduleJobSpy = jest.spyOn(schedule, 'scheduleJob').mockImplementation((cron, func) => {
                func();
                return {};
            });

            const youtubeSchedulerMock = jest.fn();
            YouTubeSchedule.prototype.youtubeScheduler = youtubeSchedulerMock;

      
            await settingRecommendMusic();

            expect(scheduleJobSpy).toHaveBeenCalledWith('0 0 */3 * *', expect.any(Function));
            expect(youtubeSchedulerMock).toHaveBeenCalled();
        });
    });

    describe('handleAlarm function test', () => {
        it('should schedule the alarm handling', async () => {
            const scheduleJobSpy = jest.spyOn(schedule, 'scheduleJob').mockImplementation((cron, func) => {
                func();
                return {};
            });

            const alarmServiceMock = Container.get(Alarm);

            await handleAlarm();
            expect(scheduleJobSpy).toHaveBeenCalledWith('0 0 */3 * *', expect.any(Function));
            expect(alarmServiceMock.handleAlarm).toHaveBeenCalledWith([{ user_id: 1, token: 'test-token' }]);
        });
    });
});
