import {UserRepository} from '../../../src/repository/User.Repository';
import {FirebaseTokenRepository} from '../../../src/repository/FirebaseToken.Repository';
import {UserService} from '../../../src/service/User.Service';
import { verifyUser } from '../../../src/util/verify';
import { User } from '../../../src/entity/User';
import { UserNumber } from '../../../src/dto/UserNumber';
import { ErrorResponseDto } from '../../../src/response/ErrorResponseDto';
import { ErrorCode } from '../../../src/exception/ErrorCode';
import { UserEmail } from '../../../src/dto/UserEmail';


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
    const user = { 
        getNumber: jest.fn().mockReturnValue(2),
        getEmail : jest.fn().mockReturnValue('email')
    } as unknown as User;
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


    describe('bringUserEmail function test', ()=>{
        it('basic',  async () => {
            const bringUserEmailResponse = UserEmail.of(user);
            userRepository.findUserById.mockResolvedValue(user);
            mockVerifyUser.mockReturnValue(null);

            const result = await userService.bringUserEmail(userId);

            expect(result).toEqual(bringUserEmailResponse);
            expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
            expect(mockVerifyUser).toHaveBeenCalledWith(user);
        
        });

        it('verifyUser error',  async () => {
            userRepository.findUserById.mockResolvedValue(undefined);
            mockVerifyUser.mockImplementation(()=>{
                throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_USER)
            })
            await expect(userService.bringUserEmail(userId))
            .rejects
            .toEqual(ErrorResponseDto.of(ErrorCode.NOT_FOUND_USER));
            expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
            expect(mockVerifyUser).toHaveBeenCalledWith(undefined);
        });
    });

    describe('penetrateFirebaseToken function test', ()=>{
        const token = 'token'
        it('basic',  async () => {
            userRepository.findUserById.mockResolvedValue(user);
            mockVerifyUser.mockReturnValue(null);

            const result = await userService.penetrateFirebaseToken(userId,token);

            expect(result).toEqual(undefined);
            expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
            expect(mockVerifyUser).toHaveBeenCalledWith(user);
            expect(firebaseTokenRepository.insertToken).toHaveBeenCalledWith(user,token);
        });

        it('verifyUser error',  async () => {
            userRepository.findUserById.mockResolvedValue(undefined);
            mockVerifyUser.mockImplementation(()=>{
                throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_USER)
            })
            await expect(userService.penetrateFirebaseToken(userId,token))
            .rejects
            .toEqual(ErrorResponseDto.of(ErrorCode.NOT_FOUND_USER));
            expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
            expect(mockVerifyUser).toHaveBeenCalledWith(undefined);
            expect(firebaseTokenRepository.insertToken).not.toHaveBeenCalledWith(user,token);
        });
    });


    describe('modifyAlarmOnOff function test', ()=>{
        const status = true;
        it('basic',  async () => {
            userRepository.findUserById.mockResolvedValue(user);
            mockVerifyUser.mockReturnValue(null);

            const result = await userService.modifyAlarmOnOff(userId,status);

            expect(result).toEqual(undefined);
            expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
            expect(mockVerifyUser).toHaveBeenCalledWith(user);
            expect(userRepository.updateAlarmStatus).toHaveBeenCalledWith(userId,status);
    
        });

        it('verifyUser error',  async () => { 
            userRepository.findUserById.mockResolvedValue(undefined);
            mockVerifyUser.mockImplementation(()=>{
                throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_USER)
            })
            await expect(userService.modifyAlarmOnOff(userId,status))
            .rejects
            .toEqual(ErrorResponseDto.of(ErrorCode.NOT_FOUND_USER));
            expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
            expect(mockVerifyUser).toHaveBeenCalledWith(undefined);
            expect(userRepository.updateAlarmStatus).not.toHaveBeenCalledWith(userId,status);
        });

    });

    describe('modifyAlarmTime function test', ()=>{
        
        const alarmStart = 'alarmStart';
        const alarmEnd = 'alarmEnd';
        it('basic',  async () => {
            userRepository.findUserById.mockResolvedValue(user);
            mockVerifyUser.mockReturnValue(null);

            const result = await userService.modifyAlarmTime(userId,alarmStart,alarmEnd);

            expect(result).toEqual(undefined);
            expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
            expect(mockVerifyUser).toHaveBeenCalledWith(user);
            expect(userRepository.updateAlarmTime).toHaveBeenCalledWith(userId,alarmStart,alarmEnd);
    
        });

        it('verifyUser error',  async () => {
            userRepository.findUserById.mockResolvedValue(undefined);
            mockVerifyUser.mockImplementation(()=>{
                throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_USER)
            })
            await expect(userService.modifyAlarmTime(userId,alarmStart,alarmEnd))
            .rejects
            .toEqual(ErrorResponseDto.of(ErrorCode.NOT_FOUND_USER));
            expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
            expect(mockVerifyUser).toHaveBeenCalledWith(undefined);
            expect(userRepository.updateAlarmTime).not.toHaveBeenCalledWith(userId,alarmStart,alarmEnd);
        });
    });

    describe('eraseUser function test', ()=>{
        it('basic',  async () => {
            userRepository.findUserById.mockResolvedValue(user);
            mockVerifyUser.mockReturnValue(null);

            const result = await userService.eraseUser(userId);

            expect(result).toEqual(undefined);
            expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
            expect(mockVerifyUser).toHaveBeenCalledWith(user);
            expect(userRepository.deleteUser).toHaveBeenCalledWith(userId);
    
        });

        it('verifyUser error',  async () => {
            userRepository.findUserById.mockResolvedValue(undefined);
            mockVerifyUser.mockImplementation(()=>{
                throw ErrorResponseDto.of(ErrorCode.NOT_FOUND_USER)
            })
            await expect(userService.eraseUser(userId))
            .rejects
            .toEqual(ErrorResponseDto.of(ErrorCode.NOT_FOUND_USER));
            expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
            expect(mockVerifyUser).toHaveBeenCalledWith(undefined);
            expect(userRepository.deleteUser).not.toHaveBeenCalledWith(userId);
        
        });
   });


});