
import { UserRepository } from '../../../src/repository/User.Repository';
import { BusStation } from '../../../src/entity/BusStation';
import { mockDeep, mockReset} from 'jest-mock-extended';
import { Repository, SelectQueryBuilder, UpdateQueryBuilder } from 'typeorm';
import { User } from '../../../src/entity/User';

const user = {} as User;

const mockSelectQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(user)
} as unknown as SelectQueryBuilder<BusStation>;

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

    // describe('findStationNumByStationId function test', () => {
    //     it('basic', async () => {

    //     });
    // });
});