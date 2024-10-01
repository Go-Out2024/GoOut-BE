import { TokenController } from "../../../src/controller/Token.Controller";
import { TokenService } from "../../../src/service/Token.Service";
import { Request, Response } from "express";
import { SuccessResponseDto } from "../../../src/response/SuccessResponseDto";
import { ErrorHandler } from "../../../src/exception/ErrorHandler";

jest.mock("../../../src/service/Token.Service");
jest.mock("../../../src/exception/ErrorHandler");

describe("Token Controller Test", () => {
  beforeAll(async () => {});

  afterAll(async () => {});

  const tokenService = new TokenService(
    {} as any,
    {} as any
  ) as jest.Mocked<TokenService>;
  const errorHandler = new ErrorHandler() as jest.Mocked<ErrorHandler>;
  const tokenController = new TokenController(tokenService, errorHandler);

  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      headers: {
        authorization: "Bearer mockRefreshToken",
      },
    } as Partial<Request>;

    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as Partial<Response>;
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("verifyRefreshToken function test", () => {
    it("basic", async () => {
      const mockNewTokens = {
        accessToken: {} as never,
        refreshToken: {} as string,
      };
      tokenService.verifyRefreshToken.mockResolvedValue(mockNewTokens);
      const result = await tokenController.verifyRefreshToken(req as Request);
      expect(result).toEqual(SuccessResponseDto.of(mockNewTokens));
      expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(
        "mockRefreshToken"
      );
    });
  });
});
