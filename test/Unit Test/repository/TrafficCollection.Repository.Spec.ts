import { TrafficCollectionRepository } from '../../../src/repository/TrafficCollection.Reposiotry';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { Repository, SelectQueryBuilder, UpdateQueryBuilder, DeleteQueryBuilder } from 'typeorm';
import { TrafficCollection } from '../../../src/entity/TrafficCollection';
import { CollectionInsert } from '../../../src/dto/request/CollectionInsert';
import { CollectionNameUpdate } from '../../../src/dto/request/CollectionNameUpdate';

const trafficCollection = {} as TrafficCollection;
const trafficCollections = [{}] as TrafficCollection[]

const mockSelectQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(), // set 메서드 추가
    select: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(trafficCollection),
    getMany: jest.fn().mockResolvedValue(trafficCollections),
    execute: jest.fn().mockResolvedValue(undefined),
} as unknown as SelectQueryBuilder<TrafficCollection>;

const mockDeleteQueryBuilder = {
  delete: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  execute: jest.fn().mockResolvedValue({ affected: 1 }),
} as unknown as DeleteQueryBuilder<TrafficCollection>;

const mockUpdateQueryBuilder = {
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  execute: jest.fn().mockResolvedValue({ affected: 1 }),
} as unknown as UpdateQueryBuilder<TrafficCollection>;

describe('TrafficCollectionRepository', () => {
  let trafficCollectionRepository: TrafficCollectionRepository;
  const mockTrafficCollectionRepository = mockDeep<Repository<TrafficCollection>>();

  beforeEach(() => {
    mockReset(mockTrafficCollectionRepository);
    trafficCollectionRepository = new TrafficCollectionRepository();
    trafficCollectionRepository['save'] = mockTrafficCollectionRepository.save;
    trafficCollectionRepository['createQueryBuilder'] = mockTrafficCollectionRepository.createQueryBuilder;
    trafficCollectionRepository['findOne'] = mockTrafficCollectionRepository.findOne;
  });

  describe('insertTrafficCollection function test', () => {
    it('basic', async () => {
      const collectionInsert = {getName: jest.fn().mockReturnValue('My Collection')} as unknown as CollectionInsert;
      const userId = 1;
      const mockExistingCollection = null; // 기존 컬렉션이 없는 경우
      mockTrafficCollectionRepository.findOne.mockResolvedValueOnce(mockExistingCollection);
      mockTrafficCollectionRepository.save.mockResolvedValueOnce(trafficCollection);
      const result = await trafficCollectionRepository.insertTrafficCollection(collectionInsert, userId);
      expect(mockTrafficCollectionRepository['findOne']).toHaveBeenCalledWith({ where: { userId } });
      expect(mockTrafficCollectionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: collectionInsert.getName(),
          choice: true,
          userId: userId,
        })
      );
      expect(result).toEqual(trafficCollection);
    });
  
    it('should insert a traffic collection when there is an existing collection', async () => {
      const collectionInsert = {getName: jest.fn().mockReturnValue('My Collection')} as unknown as CollectionInsert;
      const userId = 1;
      const mockExistingCollection = {} as TrafficCollection; // 기존 컬렉션이 있는 경우
      mockTrafficCollectionRepository.findOne.mockResolvedValueOnce(mockExistingCollection);
      mockTrafficCollectionRepository.save.mockResolvedValueOnce(trafficCollection);
      const result = await trafficCollectionRepository.insertTrafficCollection(collectionInsert, userId);
      expect(mockTrafficCollectionRepository['findOne']).toHaveBeenCalledWith({ where: { userId }});
      expect(mockTrafficCollectionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: collectionInsert.getName(),
          choice: false,
          userId: userId,
        })
      );
      expect(result).toEqual(trafficCollection);
    });
  });
  
  describe('deleteTrafficCollection function test', () => {
    it('basic', async () => {
      const collectionId = 1;
      const userId = 1;

      mockTrafficCollectionRepository.createQueryBuilder.mockReturnValueOnce(mockDeleteQueryBuilder as unknown as SelectQueryBuilder<TrafficCollection>);
      await trafficCollectionRepository.deleteTrafficCollection(collectionId, userId);

      expect(mockDeleteQueryBuilder.delete).toHaveBeenCalled();
      expect(mockDeleteQueryBuilder.from).toHaveBeenCalledWith(TrafficCollection);
      expect(mockDeleteQueryBuilder.where).toHaveBeenCalledWith('id = :collectionId', { collectionId });
      expect(mockDeleteQueryBuilder.andWhere).toHaveBeenCalledWith('user_Id = :userId', { userId });
      expect(mockDeleteQueryBuilder.execute).toHaveBeenCalled();
    });
  });

  describe('updateTrafficCollection function test', () => {
    it('basic', async () => {
      const collectionNameUpdate = new CollectionNameUpdate();
      const userId = 1;

      mockTrafficCollectionRepository.createQueryBuilder.mockReturnValueOnce(mockUpdateQueryBuilder as unknown as SelectQueryBuilder<TrafficCollection>);
      await trafficCollectionRepository.updateTrafficCollection(collectionNameUpdate, userId);

      expect(mockUpdateQueryBuilder.update).toHaveBeenCalledWith(TrafficCollection);
      expect(mockUpdateQueryBuilder.set).toHaveBeenCalledWith({ name: collectionNameUpdate.getName() });
      expect(mockUpdateQueryBuilder.where).toHaveBeenCalledWith('id = :collectionId', { collectionId: collectionNameUpdate.getCollectionId() });
      expect(mockUpdateQueryBuilder.andWhere).toHaveBeenCalledWith('user_Id = :userId', { userId });
      expect(mockUpdateQueryBuilder.execute).toHaveBeenCalled();
    });
  });

  describe('updateAllChoicesToFalse function test', () => {
    it('basic', async () => {
      const userId = 1;

      mockTrafficCollectionRepository.createQueryBuilder.mockReturnValueOnce(mockUpdateQueryBuilder as unknown as SelectQueryBuilder<TrafficCollection>);
      await trafficCollectionRepository.updateAllChoicesToFalse(userId);

      expect(mockUpdateQueryBuilder.update).toHaveBeenCalledWith(TrafficCollection);
      expect(mockUpdateQueryBuilder.set).toHaveBeenCalledWith({ choice: false });
      expect(mockUpdateQueryBuilder.where).toHaveBeenCalledWith('user_id = userId', { userId });
      expect(mockUpdateQueryBuilder.execute).toHaveBeenCalled();
    });
  });

  describe('updateChoiceByCollectionId', () => {
    it('basic', async () => {
      const userId = 1;
      const collectionId = 1;

      mockTrafficCollectionRepository.createQueryBuilder.mockReturnValueOnce(mockUpdateQueryBuilder as unknown as SelectQueryBuilder<TrafficCollection>);
      await trafficCollectionRepository.updateChoiceByCollectionId(userId, collectionId);

      expect(mockUpdateQueryBuilder.update).toHaveBeenCalledWith(TrafficCollection);
      expect(mockUpdateQueryBuilder.set).toHaveBeenCalledWith({ choice: true });
      expect(mockUpdateQueryBuilder.where).toHaveBeenCalledWith('user_id = :userId AND id = :collectionId', { userId, collectionId });
      expect(mockUpdateQueryBuilder.execute).toHaveBeenCalled();
    });
  });
	
describe('findTrafficCollectionByCollectionIdAndUserId function test', () => {
        it('basic', async () => {
            const collectionId = 1;
            const userId = 1;

            mockTrafficCollectionRepository.createQueryBuilder.mockReturnValueOnce(mockSelectQueryBuilder);
            const result = await trafficCollectionRepository.findTrafficCollectionByCollectionIdAndUserId(collectionId, userId);

            expect(result).toEqual(trafficCollection);
            expect(mockSelectQueryBuilder.where).toHaveBeenCalledWith('id = :collectionId', { collectionId });
            expect(mockSelectQueryBuilder.andWhere).toHaveBeenCalledWith('user_id = :userId', { userId });
            expect(mockSelectQueryBuilder.getOne).toHaveBeenCalled();
        });
    });
describe('findTrafficCollectionsByUserId function test', () => {
        it('basic', async () => {
            const userId = 1;

            mockTrafficCollectionRepository.createQueryBuilder.mockReturnValueOnce(mockSelectQueryBuilder);
            const result = await trafficCollectionRepository.findTrafficCollectionsByUserId(userId);

            expect(result).toEqual(trafficCollections);
            expect(mockSelectQueryBuilder.where).toHaveBeenCalledWith('trafficCollection.user_id = :userId', { userId });
            expect(mockSelectQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('trafficCollection.trafficCollectionDetails', 'trafficCollectionDetails');
            expect(mockSelectQueryBuilder.orderBy).toHaveBeenCalledWith("trafficCollection.id", "ASC");
            expect(mockSelectQueryBuilder.getMany).toHaveBeenCalled();
        });
    });

    describe('findTrafficCollectionDetailsById function test', () => {
        it('basic', async () => {
            const userId = 1;
            const collectionId = 1;

            mockTrafficCollectionRepository.createQueryBuilder.mockReturnValueOnce(mockSelectQueryBuilder);
            const result = await trafficCollectionRepository.findTrafficCollectionDetailsById(userId, collectionId);

            expect(result).toEqual(trafficCollection);
            expect(mockSelectQueryBuilder.where).toHaveBeenCalledWith('trafficCollection.user_id = :userId', { userId });
            expect(mockSelectQueryBuilder.andWhere).toHaveBeenCalledWith('trafficCollection.id = :collectionId', { collectionId });
            expect(mockSelectQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('trafficCollection.trafficCollectionDetails', 'trafficCollectionDetails');
            expect(mockSelectQueryBuilder.getOne).toHaveBeenCalled();
        });
    });
describe('findMainTrafficCollection function test', () => {
        it('basic', async () => {
            const userId = 1;
            const status = 'goToWork';

            mockTrafficCollectionRepository.createQueryBuilder.mockReturnValueOnce(mockSelectQueryBuilder);
            const result = await trafficCollectionRepository.findMainTrafficCollection(userId, status);

            expect(result).toEqual(trafficCollection);
            expect(mockSelectQueryBuilder.where).toHaveBeenCalledWith('trafficCollection.user_id = :userId', { userId });
            expect(mockSelectQueryBuilder.andWhere).toHaveBeenCalledWith('trafficCollection.choice = true');
            expect(mockSelectQueryBuilder.andWhere).toHaveBeenCalledWith('trafficCollectionDetails.status = :status', { status });
            expect(mockSelectQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('trafficCollection.trafficCollectionDetails', 'trafficCollectionDetails');
            expect(mockSelectQueryBuilder.getOne).toHaveBeenCalled();
        });
    });
});
