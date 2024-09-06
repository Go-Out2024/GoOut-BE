
import { CalendarService } from '../../../src/service/Calendar.Service';
import { CalendarInsert } from '../../../src/dto/request/CalendarInsert';
import { CalendarRepository } from '../../../src/repository/Calendar.Repository';
import { UserRepository} from '../../../src/repository/User.Repository';
import { User } from '../../../src/entity/User';
import { verifyUser } from '../../../src/util/verify';

jest.mock('../../../src/repository/Calendar.Repository');
jest.mock('../../../src/repository/User.Repository');
jest.mock('../../../src/util/verify', ()=>({
    verifyUser: jest.fn()
}));

describe('Calendar Service Test', ()=>{

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    const calendarRepository = new CalendarRepository() as jest.Mocked<CalendarRepository>;
    const userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    const calendarService = new CalendarService(calendarRepository, userRepository);


    beforeEach(async () => {
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });
    


    describe('penetrateScheduleOrProductt function test', ()=>{

        const calendarContents = new CalendarInsert();
        const userId = 1;
        const user = {} as User;
        const mockVerifyUser = verifyUser as jest.Mock;

        it('basic', async ()=>{

            userRepository.findUserById.mockResolvedValue(user);



            const result = await calendarService.penetrateScheduleOrProduct(calendarContents, userId);
            expect(result).toEqual(undefined);
            expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
            expect(mockVerifyUser).toHaveBeenCalledWith(user);
            
        });

    });
});


