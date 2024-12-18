import { FirebaseTokenRepository } from "../../../src/repository/FirebaseToken.Repository";
import { mockDeep, mockReset } from "jest-mock-extended";
import {
  Repository,
  DeleteQueryBuilder,
  SelectQueryBuilder,
  UpdateQueryBuilder,
} from "typeorm";
import { FirebaseToken } from "../../../src/entity/FirebaseToken";
import { User } from "../../../src/entity/User";

const firebaseToken = {} as FirebaseToken;
const mockDeleteQueryBuilder = {
  delete: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  execute: jest.fn().mockResolvedValue({ affected: 1 }),
} as unknown as DeleteQueryBuilder<FirebaseToken>;

const mockSelectQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getOne: jest.fn().mockResolvedValue(firebaseToken),
  getMany: jest.fn().mockResolvedValue(firebaseToken),
} as unknown as SelectQueryBuilder<FirebaseToken>;

describe("FirebaseTokenRepository", () => {
  let firebaseTokenRepository: FirebaseTokenRepository;
  const mockFirebaseTokenRepository = mockDeep<Repository<FirebaseToken>>();

  beforeEach(() => {
    mockReset(mockFirebaseTokenRepository);
    firebaseTokenRepository = new FirebaseTokenRepository();
    firebaseTokenRepository["create"] = mockFirebaseTokenRepository.create;
    firebaseTokenRepository["save"] = mockFirebaseTokenRepository.save;
    firebaseTokenRepository["createQueryBuilder"] =
      mockFirebaseTokenRepository.createQueryBuilder;
  });

  describe("insertToken function test", () => {
    const user = {} as User;
    const token = "token";
    const firebaseToken = { token: "token", user: {} } as FirebaseToken;
    it("basic", async () => {
      mockFirebaseTokenRepository.create.mockReturnValueOnce(firebaseToken);
      mockFirebaseTokenRepository.save.mockResolvedValue(firebaseToken);
      const result = await firebaseTokenRepository.insertToken(user, token);
      expect(result).toEqual(firebaseToken);
      expect(mockFirebaseTokenRepository.create).toHaveBeenCalledWith({
        user,
        token,
      });
      expect(mockFirebaseTokenRepository.create).toHaveBeenCalledWith(
        firebaseToken
      );
    });
  });

  describe("deleteTokensByUserId function test", () => {
    const userId = 1;
    const firebaseToken = "token";
    it("basic", async () => {
      mockFirebaseTokenRepository.createQueryBuilder.mockReturnValueOnce(
        mockDeleteQueryBuilder as unknown as SelectQueryBuilder<FirebaseToken>
      );
      const result = await firebaseTokenRepository.deleteTokensByUserId(
        userId,
        firebaseToken
      );
      expect(result).toBeUndefined();
      expect(firebaseTokenRepository["createQueryBuilder"]).toHaveBeenCalled();
      expect(mockDeleteQueryBuilder.delete).toHaveBeenCalled();
      expect(mockDeleteQueryBuilder.from).toHaveBeenCalledWith(FirebaseToken);
      expect(mockDeleteQueryBuilder.where).toHaveBeenCalledWith(
        "user.id = :userId AND token = :token",
        { userId, token: firebaseToken }
      );
      expect(mockDeleteQueryBuilder.execute).toHaveBeenCalled();
    });
  });

  describe("findTokenByUserId function test", () => {
    const userId = 1;
    it("basic", async () => {
      mockFirebaseTokenRepository.createQueryBuilder.mockReturnValueOnce(
        mockSelectQueryBuilder
      );
      const result = await firebaseTokenRepository.findTokenByUserId(userId);
      expect(result).toEqual(firebaseToken);
      expect(
        firebaseTokenRepository["createQueryBuilder"]
      ).toHaveBeenCalledWith("firebaseToken");
      expect(mockSelectQueryBuilder.where).toHaveBeenCalledWith(
        "firebaseToken.user.id = :userId",
        { userId }
      );
      expect(mockSelectQueryBuilder.getOne).toHaveBeenCalled();
    });
  });
});
