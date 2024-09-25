
import { UserRepository } from '../../../src/repository/User.Repository';
import { mockDeep, mockReset} from 'jest-mock-extended';
import { Repository, DeleteQueryBuilder,SelectQueryBuilder, UpdateQueryBuilder } from 'typeorm';
import { User } from '../../../src/entity/User';

const user = {} as User;

const mockDeleteQueryBuilder = {
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ affected: 1 })
} as unknown as DeleteQueryBuilder<User>;

const mockUpdateQueryBuilder = {
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    setParameters: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ affected: 1 })
} as unknown as UpdateQueryBuilder<User>;

describe('UserRepository', () => {
    let userRepository : UserRepository;
    const mockUserRepository = mockDeep<Repository<User>>();

    beforeEach(() => {
        mockReset(mockUserRepository);
        userRepository = new UserRepository();
        userRepository['findOne'] = mockUserRepository.findOne;
        userRepository['create'] = mockUserRepository.create;
        userRepository['save'] = mockUserRepository.save;
        userRepository['createQueryBuilder'] = mockUserRepository.createQueryBuilder;
       
    });

    describe('findByKakaoId function test', () => {
        it('basic', async () => {
            const kakaoId = '1212';
            mockUserRepository.findOne.mockResolvedValue(user);
            const result = await userRepository.findByKakaoId(kakaoId);
            expect(result).toEqual(user);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: {numbers:kakaoId} });     
        });
    });

    describe('createUser function test', () => {
        it('basic', async () => {
            const userData =  {numbers: "1212", email: '11@naver.com'}
            mockUserRepository.create.mockReturnValueOnce(user);
            mockUserRepository.save.mockResolvedValue(user);
            const result = await userRepository.createUser(userData);
            expect(result).toEqual(user);
            expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
            expect(mockUserRepository.save).toHaveBeenCalledWith(user);
        });
    });

    describe('findUserById function test', () => {
        it('basic', async () => {
            const id = 1
            mockUserRepository.findOne.mockResolvedValue(user);
            const result = await userRepository.findUserById(id);
            expect(result).toEqual(user);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: {id} })
        });
    });

    describe('updateAlarmStatus function test', () => {
        it('basic', async () => {
            const userId = 1;
            const status = true;
            mockUserRepository.createQueryBuilder.mockReturnValueOnce(mockUpdateQueryBuilder as unknown as SelectQueryBuilder<User>);
            const result = await userRepository.updateAlarmStatus(userId, status);
            expect(result).toEqual({affected:1});
            expect(userRepository['createQueryBuilder']).toHaveBeenCalled();
            expect(mockUpdateQueryBuilder.update).toHaveBeenCalledWith(User);
            expect(mockUpdateQueryBuilder.set).toHaveBeenCalledWith({ alarm: status });
            expect(mockUpdateQueryBuilder.where).toHaveBeenCalledWith('id = :userId', { userId });
            expect(mockUpdateQueryBuilder.execute).toHaveBeenCalled();
        });
    });

    describe('updateAlarmTime function test', () => {
        it('basic', async () => {
            const userId = 1;
            const alarmStart = 'alarm-start';
            const alarmEnd = 'alarm-end'
            mockUserRepository.createQueryBuilder.mockReturnValueOnce(mockUpdateQueryBuilder as unknown as SelectQueryBuilder<User>);
            const result = await userRepository.updateAlarmTime(userId, alarmStart, alarmEnd);
            expect(result).toEqual({affected:1});
            expect(userRepository['createQueryBuilder']).toHaveBeenCalled();
            expect(mockUpdateQueryBuilder.update).toHaveBeenCalledWith(User);
            expect(mockUpdateQueryBuilder.set).toHaveBeenCalledWith({alarmStart:alarmStart, alarmEnd:alarmEnd});
            expect(mockUpdateQueryBuilder.where).toHaveBeenCalledWith('id = :userId',{userId});
            expect(mockUpdateQueryBuilder.execute).toHaveBeenCalled();
        });
    });

    describe('deleteUser function test', () => {
        it('basic', async () => {
            const userId = 1;
            mockUserRepository.createQueryBuilder.mockReturnValueOnce(mockDeleteQueryBuilder as unknown as SelectQueryBuilder<User>);
            const result = await userRepository.deleteUser(userId);
            expect(result).toEqual({affected:1});
            expect(userRepository['createQueryBuilder']).toHaveBeenCalled();
            expect(mockDeleteQueryBuilder.delete).toHaveBeenCalled();
            expect(mockDeleteQueryBuilder.from).toHaveBeenCalledWith(User);
            expect(mockDeleteQueryBuilder.where).toHaveBeenCalledWith('id = :userId',{userId});
            expect(mockUpdateQueryBuilder.execute).toHaveBeenCalled();
        });
    });
});