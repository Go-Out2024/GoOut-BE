import {UserRepository} from '../../../src/repository/User.Repository';
import {FirebaseTokenRepository} from '../../../src/repository/FirebaseToken.Repository';
import {UserService} from '../../../src/service/User.Service';
import { verifyUser } from '../../../src/util/verify';
import { User } from '../../../src/entity/User';
import { UserNumber } from '../../../src/dto/UserNumber';
import { ErrorResponseDto } from '../../../src/response/ErrorResponseDto';
import { ErrorCode } from '../../../src/exception/ErrorCode';


jest.mock('../../../src/repository/User.Repository');
jest.mock('../../../src/repository/FirebaseToken.Repository');
jest.mock('../../../src/util/verify');

describe('User Service Test', ()=>{

    beforeAll(async()=>{
    })

    afterAll(async()=>{
    });

    const userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    const firebaseTokenRepository = new FirebaseTokenRepository() as jest.Mocked<FirebaseTokenRepository>;
    const mockVerifyUser = verifyUser as jest.Mock;
    let userService:UserService;
    const user = { getNumber: jest.fn().mockReturnValue(2) } as unknown as User;
    const userId = 1;


    beforeEach(async () => {
        userService = new UserService(userRepository, firebaseTokenRepository);
        jest.clearAllMocks();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });
    
    describe('bringUserNumber function test', ()=>{
        it('basic',  async () => {
            const bringUserNumberResponse = UserNumber.of(user);
            userRepository.findUserById.mockResolvedValue(user);
            mockVerifyUser.mockReturnValue(null);

            const result = await userService.bringUserNumber(userId);

            expect(result).toEqual(bringUserNumberResponse);
            expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
            expect(mockVerifyUser).toHaveBeenCalledWith(user);
        });

        it('verifyUser error',  async () => {
            userRepository.findUserById.mockResolvedValue(undefined);
            mockVerifyUser.mockImplementation(()=>{
                throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_USER)
            })
            await expect(userService.bringUserNumber(userId))
            .rejects
            .toEqual(ErrorResponseDto.of(ErrorCode.NOT_FOUND_USER));
            expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
            expect(mockVerifyUser).toHaveBeenCalledWith(undefined);
        });
    });


    // describe('bringUserEmail function test', ()=>{
    //     it('basic',  async () => {
        
    //     });
    // });

    // describe('penetrateFirebaseToken function test', ()=>{
    //     it('basic',  async () => {
       
    //     });
    // });
});