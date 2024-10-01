import { TrafficService } from "../../../src/service/Traffic.Service";
import { UserRepository } from "../../../src/repository/User.Repository";
import { TrafficCollectionRepository } from "../../../src/repository/TrafficCollection.Reposiotry";
import { TrafficCollectionDetailRepository } from "../../../src/repository/TrafficCollectionDetail.Repository";
import { TransportationRepository } from "../../../src/repository/Transportation.Repository";
import { TransportationNumberRepository } from "../../../src/repository/TransportationNumber.Repository";
import { BusStationRepository } from "../../../src/repository/BusStation.Repository";
import { SubwayApi } from "../../../src/util/publicData";
import { BusApi } from "../../../src/util/publicData";
import { CollectionNameUpdate } from "../../../src/dto/request/CollectionNameUpdate";
import { CollectionDetailUpdate } from "../../../src/dto/request/CollectionDetailUpdate";
import { CollectionInsert } from "../../../src/dto/request/CollectionInsert";
import { after } from "node:test";
import { TrafficCollection } from "../../../src/entity/TrafficCollection";
import { User } from "../../../src/entity/User";
import { TransportationNumber } from "../../../src/entity/TransportationNumber";
import { SubwayArrivalInfo } from "../../../src/dto/values/SubwayArrivalInfo";
import {
  BusStationResult,
  SubwayStationResult,
} from "../../../src/dto/values/StationResult";
import { BusStation } from "../../../src/entity/BusStation";
import {
  BusArrivalInfo,
  BusStationInfo,
  Station,
} from "../../../src/dto/values/BusArrivalInfo";
import { Transportation } from "../../../src/entity/Transportation";
import { TransportationDetailDto } from "../../../src/dto/request/TransportationDetailDto";
import { TrafficCollectionDetail } from "../../../src/entity/TrafficCollectionDetail";
import { ErrorResponseDto } from "../../../src/response/ErrorResponseDto";
import { ErrorCode } from "../../../src/exception/ErrorCode";

jest.mock("../../../src/repository/User.Repository");
jest.mock("../../../src/repository/TrafficCollection.Reposiotry");
jest.mock("../../../src/repository/TrafficCollectionDetail.Repository");
jest.mock("../../../src/repository/Transportation.Repository");
jest.mock("../../../src/repository/TransportationNumber.Repository");
jest.mock("../../../src/repository/BusStation.Repository");
jest.mock("../../../src/util/publicData");
jest.mock("../../../src/util/publicData");

describe("Traffic Service Test", () => {
  beforeAll(async () => {});
  afterAll(async () => {});

  const userRepository = new UserRepository() as jest.Mocked<UserRepository>;
  const trafficCollectionRepository =
    new TrafficCollectionRepository() as jest.Mocked<TrafficCollectionRepository>;
  const trafficCollectionDetailRepository =
    new TrafficCollectionDetailRepository() as jest.Mocked<TrafficCollectionDetailRepository>;
  const transportationRepository =
    new TransportationRepository() as jest.Mocked<TransportationRepository>;
  const transportationNumberRepository =
    new TransportationNumberRepository() as jest.Mocked<TransportationNumberRepository>;
  const busStationRepository =
    new BusStationRepository() as jest.Mocked<BusStationRepository>;
  const subwayApi = new SubwayApi() as jest.Mocked<SubwayApi>;
  const busApi = new BusApi() as jest.Mocked<BusApi>;
  let trafficService: TrafficService;

  beforeEach(() => {
    trafficService = new TrafficService(
      userRepository,
      trafficCollectionRepository,
      trafficCollectionDetailRepository,
      transportationRepository,
      transportationNumberRepository,
      busStationRepository,
      subwayApi,
      busApi
    );
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("penetrateTrafficCollection function test", () => {
    it("basic", async () => {
      const collectionInsert = new CollectionInsert();
      const userId = 1;
      const trafficCollcection = {} as TrafficCollection;
      trafficCollectionRepository.insertTrafficCollection.mockResolvedValue(
        trafficCollcection
      );
      const verifyInsertTrafficCollectionStatusSpy = jest
        .spyOn(trafficService as any, "verifyInsertTrafficCollectionStatus")
        .mockResolvedValue(null);
      const result = await trafficService.penetrateTrafficCollection(
        collectionInsert,
        userId
      );
      expect(result).toEqual(undefined);
      expect(
        trafficCollectionRepository.insertTrafficCollection
      ).toHaveBeenCalledWith(collectionInsert, userId);
      expect(verifyInsertTrafficCollectionStatusSpy).toHaveBeenCalledWith(
        collectionInsert,
        trafficCollcection
      );
    });
  });
  describe("penetrateTrafficCollectionDetail function test", () => {
    it("should successfully insert traffic collection details", async () => {
      const detailDto = {
        getDeparture: jest.fn().mockReturnValue({
          name: "Station A",
          type: "subway",
          route: "Line 1",
          getNumbers: jest.fn().mockReturnValue(["1001"]),
        }),
        getArrival: jest.fn().mockReturnValue({
          name: "Station B",
          type: "subway",
          route: "Line 1",
          getNumbers: jest.fn().mockReturnValue(["1002"]),
        }),
      } as unknown as TransportationDetailDto;
      const trafficCollection = {} as TrafficCollection;
      const trafficCollectionDetail = {} as TrafficCollectionDetail;
      const transportation = {} as Transportation;
      const transportationNumbers = [] as TransportationNumber[];
      const insertTrafficCollectionDetailSpy = jest
        .spyOn(
          trafficService["trafficCollectionDetailRepository"],
          "insertTrafficCollectionDetail"
        )
        .mockResolvedValue(trafficCollectionDetail);
      const insertTransportationSpy = jest
        .spyOn(
          trafficService["transportationRepository"],
          "insertTransportation"
        )
        .mockResolvedValue(transportation);
      const insertTransportationNumbersSpy = jest
        .spyOn(
          trafficService["transportationNumberRepository"],
          "insertTransportationNumbers"
        )
        .mockResolvedValue(transportationNumbers);
      await trafficService["penetrateTrafficCollectionDetail"](
        detailDto,
        trafficCollection
      );
      expect(insertTrafficCollectionDetailSpy).toHaveBeenCalledWith(
        detailDto,
        trafficCollection
      );
      expect(insertTransportationSpy).toHaveBeenCalledTimes(2); // one for departure and one for arrival
      expect(insertTransportationNumbersSpy).toHaveBeenCalledTimes(2); // one for departure and one for arrival
      expect(insertTransportationNumbersSpy).toHaveBeenCalledWith(
        ["1001"],
        expect.anything()
      );
      expect(insertTransportationNumbersSpy).toHaveBeenCalledWith(
        ["1002"],
        expect.anything()
      );
    });
  });

  describe("eraseTrafficCollection function test", () => {
    it("basic", async () => {
      const userId = 1;
      const collectionId = 1;
      const result = await trafficService.eraseTrafficCollection(
        userId,
        collectionId
      );
      expect(result).toEqual(undefined);
      expect(
        trafficCollectionRepository.deleteTrafficCollection
      ).toHaveBeenCalledWith(collectionId, userId);
    });
  });

  describe("modifyTrafficCollectionName function test", () => {
    it("basic", async () => {
      const collectionNameUpdate = {} as CollectionNameUpdate;
      const userId = 1;
      const result = await trafficService.modifyTrafficCollectionName(
        collectionNameUpdate,
        userId
      );
      expect(result).toEqual(undefined);
      expect(
        trafficCollectionRepository.updateTrafficCollection
      ).toHaveBeenCalledWith(collectionNameUpdate, userId);
    });
  });

  describe("modifyTrafficCollectionDetail function test", () => {
    it("basic", async () => {
      const collectionDetailUpdate = {
        getGoToWork: jest.fn().mockReturnValue({}),
        getGoHome: jest.fn().mockReturnValue({}),
        getCollectionId: jest.fn().mockReturnValue(1),
      } as unknown as CollectionDetailUpdate;

      const trafficCollection = {
        getId: jest.fn().mockReturnValue(1),
      } as unknown as TrafficCollection;
      trafficCollectionRepository.findTrafficCollectionByCollectionIdAndUserId.mockResolvedValue(
        trafficCollection
      );
      trafficCollectionDetailRepository.deleteTrafficCollectionDetailsByCollectionId.mockResolvedValue(
        undefined
      );
      const verifyUpdateTrafficCollectionStatusSpy = jest
        .spyOn(trafficService as any, "verifyUpdateTrafficCollectionStatus")
        .mockResolvedValue(null);
      const result = await trafficService.modifyTrafficCollectionDetail(
        collectionDetailUpdate,
        1
      );
      expect(result).toEqual(undefined);
      expect(
        trafficCollectionRepository.findTrafficCollectionByCollectionIdAndUserId
      ).toHaveBeenCalledWith(1, 1);
      expect(
        trafficCollectionDetailRepository.deleteTrafficCollectionDetailsByCollectionId
      ).toHaveBeenCalledWith(1);
      expect(verifyUpdateTrafficCollectionStatusSpy).toHaveBeenCalledWith(
        collectionDetailUpdate,
        trafficCollection
      );
    });
  });

  describe("bringTrafficCollectionsByUserId function test", () => {
    it("basic", async () => {
      const userId = 1;
      const currentTime = new Date();
      const collections = [
        {
          trafficCollectionDetails: [
            { getStatus: jest.fn().mockReturnValue("goToWork") },
            { getStatus: jest.fn().mockReturnValue("goToWork") },
          ],
        },
        {
          trafficCollectionDetails: [
            { getStatus: jest.fn().mockReturnValue("goToWork") },
            { getStatus: jest.fn().mockReturnValue("goHome") },
          ],
        },
      ] as unknown as TrafficCollection[];
      trafficCollectionRepository.findTrafficCollectionsByUserId.mockResolvedValue(
        collections
      );
      const result = await trafficService.bringTrafficCollectionsByUserId(
        userId,
        currentTime
      );
      expect(result).toBeDefined();
      expect(
        trafficCollectionRepository.findTrafficCollectionsByUserId
      ).toHaveBeenCalledWith(userId);
    });
  });

  describe("bringTrafficCollectionDetailsById function test", () => {
    it("basic", async () => {
      const userId = 1;
      const collectionId = 1;
      const trafficCollcection = {} as TrafficCollection;
      trafficCollectionRepository.findTrafficCollectionDetailsById.mockResolvedValue(
        trafficCollcection
      );
      const result = await trafficService.bringTrafficCollectionDetailsById(
        userId,
        collectionId
      );
      expect(result).toEqual(trafficCollcection);
      expect(
        trafficCollectionRepository.findTrafficCollectionDetailsById
      ).toHaveBeenCalledWith(userId, collectionId);
    });
  });

  describe("choiceTrafficCollection function test", () => {
    it("basic", async () => {
      const userId = 1;
      const collectionId = 1;
      trafficCollectionRepository.updateAllChoicesToFalse.mockResolvedValue(
        undefined
      );
      trafficCollectionRepository.updateChoiceByCollectionId.mockResolvedValue(
        undefined
      );
      const result = await trafficService.choiceTrafficCollection(
        userId,
        collectionId
      );
      expect(result).toEqual(undefined);
      expect(
        trafficCollectionRepository.updateAllChoicesToFalse
      ).toHaveBeenCalledWith(userId);
      expect(
        trafficCollectionRepository.updateChoiceByCollectionId
      ).toHaveBeenCalledWith(userId, collectionId);
    });
  });
  describe("bringTrafficCollectionsByUserId function test", () => {
    it("should filter by goToWork when current time is before 14:00", async () => {
      const userId = 1;
      const currentTime = new Date("2024-09-24T02:08:45.941Z");
      const collections = [
        {
          trafficCollectionDetails: [
            { getStatus: jest.fn().mockReturnValue("goToWork") },
            { getStatus: jest.fn().mockReturnValue("goToWork") },
          ],
        },
        {
          trafficCollectionDetails: [
            { getStatus: jest.fn().mockReturnValue("goToWork") },
            { getStatus: jest.fn().mockReturnValue("goHome") },
          ],
        },
      ] as unknown as TrafficCollection[];
      trafficCollectionRepository.findTrafficCollectionsByUserId.mockResolvedValue(
        collections
      );
      const result = await trafficService.bringTrafficCollectionsByUserId(
        userId,
        currentTime
      );
      expect(result[0].trafficCollectionDetails).toHaveLength(2); // 모두 'goToWork'
      expect(result[1].trafficCollectionDetails).toHaveLength(1); // 'goHome'은 필터링됨
      expect(result[1].trafficCollectionDetails[0].getStatus()).toBe(
        "goToWork"
      );
    });

    it("should filter by goHome when current time is after 14:00", async () => {
      const userId = 1;
      const currentTime = new Date("2024-09-24T06:08:45.941Z"); // 오후 시간 (15:08)
      const collections = [
        {
          trafficCollectionDetails: [
            { getStatus: jest.fn().mockReturnValue("goToWork") },
            { getStatus: jest.fn().mockReturnValue("goHome") },
          ],
        },
        {
          trafficCollectionDetails: [
            { getStatus: jest.fn().mockReturnValue("goHome") },
            { getStatus: jest.fn().mockReturnValue("goToWork") },
          ],
        },
      ] as unknown as TrafficCollection[];
      trafficCollectionRepository.findTrafficCollectionsByUserId.mockResolvedValue(
        collections
      );
      const result = await trafficService.bringTrafficCollectionsByUserId(
        userId,
        currentTime
      );
      expect(result[0].trafficCollectionDetails).toHaveLength(1); // 'goToWork'은 필터링됨
      expect(result[0].trafficCollectionDetails[0].getStatus()).toBe("goHome");
      expect(result[1].trafficCollectionDetails).toHaveLength(1); // 'goToWork'은 필터링됨
      expect(result[1].trafficCollectionDetails[0].getStatus()).toBe("goHome");
    });
  });

  describe("bringMainTrafficCollection function test", () => {
    const mockCurrentTime = (hour: number) => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2024, 8, 26, hour, 0, 0)); // Mock current time to specific hour
    };

    afterEach(() => {
      jest.useRealTimers();
    });
    it("should handle goHome status and then switch to goToWork if no collection is found for goHome 1", async () => {
      mockCurrentTime(15);
      const userId = 1;
      const mockCollection = {
        trafficCollectionDetails: [
          {
            getStatus: jest.fn().mockReturnValue("goToWork"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Subway"),
                getStationName: jest.fn().mockReturnValue("Station 1"),
                getId: jest.fn().mockReturnValue(1),
              },
            ],
          },
        ],
      } as unknown as TrafficCollection;

      // 첫 번째 호출에서는 goHome 데이터가 없고, 두 번째 호출에서는 goToWork 데이터를 반환하도록 설정
      trafficCollectionRepository.findMainTrafficCollection
        .mockResolvedValueOnce(null) // goHome에 대한 조회 결과가 없을 때
        .mockResolvedValueOnce(mockCollection); // goToWork로 전환 후 조회 성공

      transportationNumberRepository.findTransportationNumbers.mockResolvedValue(
        [
          { getNumbers: jest.fn().mockReturnValue("1001") },
        ] as unknown as TransportationNumber[]
      );
      const subwayArrivalInfo = [] as SubwayArrivalInfo[];
      jest
        .spyOn(trafficService as any, "bringMainSubwayArrivalInfo")
        .mockResolvedValue(subwayArrivalInfo);

      const result = await trafficService.bringMainTrafficCollection(userId);

      expect(result.collection).toBeDefined();
      expect(result.result).toBeDefined();
      expect(
        trafficCollectionRepository.findMainTrafficCollection
      ).toHaveBeenCalledWith(userId, "goHome");
      expect(
        trafficCollectionRepository.findMainTrafficCollection
      ).toHaveBeenCalledWith(userId, "goToWork");
    });

    it("should handle goHome status and then switch to goToWork if no collection is found for goHome 2", async () => {
      mockCurrentTime(23);
      const userId = 1;
      const mockCollection = {
        trafficCollectionDetails: [
          {
            getStatus: jest.fn().mockReturnValue("goToWork"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Subway"),
                getStationName: jest.fn().mockReturnValue("Station 1"),
                getId: jest.fn().mockReturnValue(1),
              },
            ],
          },
        ],
      } as unknown as TrafficCollection;

      // 첫 번째 호출에서는 goHome 데이터가 없고, 두 번째 호출에서는 goToWork 데이터를 반환하도록 설정
      trafficCollectionRepository.findMainTrafficCollection
        .mockResolvedValueOnce(null) // goHome에 대한 조회 결과가 없을 때
        .mockResolvedValueOnce(mockCollection); // goToWork로 전환 후 조회 성공

      transportationNumberRepository.findTransportationNumbers.mockResolvedValue(
        [
          { getNumbers: jest.fn().mockReturnValue("1001") },
        ] as unknown as TransportationNumber[]
      );
      const subwayArrivalInfo = [] as SubwayArrivalInfo[];
      jest
        .spyOn(trafficService as any, "bringMainSubwayArrivalInfo")
        .mockResolvedValue(subwayArrivalInfo);

      const result = await trafficService.bringMainTrafficCollection(userId);

      expect(result.collection).toBeDefined();
      expect(result.result).toBeDefined();
      expect(
        trafficCollectionRepository.findMainTrafficCollection
      ).toHaveBeenCalledWith(userId, "goHome");
      expect(
        trafficCollectionRepository.findMainTrafficCollection
      ).toHaveBeenCalledWith(userId, "goToWork");
    });

    it("should handle ErrorResponseDto for Subway arrival info not found 1", async () => {
      const userId = 1;
      mockCurrentTime(15);
      const mockCollection = {
        trafficCollectionDetails: [
          {
            getStatus: jest.fn().mockReturnValue("goToWork"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Subway"),
                getStationName: jest.fn().mockReturnValue("Station 1"),
                getId: jest.fn().mockReturnValue(1),
              },
            ],
          },
          {
            getStatus: jest.fn().mockReturnValue("goHome"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Subway"),
                getStationName: jest.fn().mockReturnValue("Station 2"),
                getId: jest.fn().mockReturnValue(2),
              },
            ],
          },
        ],
      } as unknown as TrafficCollection;

      trafficCollectionRepository.findMainTrafficCollection.mockResolvedValueOnce(
        mockCollection
      );
      transportationNumberRepository.findTransportationNumbers.mockResolvedValue(
        [
          { getNumbers: jest.fn().mockReturnValue("1001") },
        ] as unknown as TransportationNumber[]
      );

      const errorResponse = ErrorResponseDto.of<SubwayArrivalInfo>(
        ErrorCode.NOT_FOUND_SUBWAY_ARRIVAL_INFO
      );
      jest
        .spyOn(trafficService as any, "bringMainSubwayArrivalInfo")
        .mockRejectedValue(errorResponse);

      const result = await trafficService.bringMainTrafficCollection(userId);

      expect(result.collection).toBeDefined();
      expect(result.result.getSubwayErrorMessage()).toBe(
        errorResponse.getMessage()
      );
      expect(result.result.getBusStations()).toBeUndefined();
      expect(result.result.getSubwayStation()).toBeUndefined();
    });

    it("should handle ErrorResponseDto for Subway arrival info not found 2", async () => {
      const userId = 1;
      mockCurrentTime(10);
      const mockCollection = {
        trafficCollectionDetails: [
          {
            getStatus: jest.fn().mockReturnValue("goToWork"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Subway"),
                getStationName: jest.fn().mockReturnValue("Station 1"),
                getId: jest.fn().mockReturnValue(1),
              },
            ],
          },
          {
            getStatus: jest.fn().mockReturnValue("goHome"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Subway"),
                getStationName: jest.fn().mockReturnValue("Station 2"),
                getId: jest.fn().mockReturnValue(2),
              },
            ],
          },
        ],
      } as unknown as TrafficCollection;

      trafficCollectionRepository.findMainTrafficCollection.mockResolvedValueOnce(
        mockCollection
      );
      transportationNumberRepository.findTransportationNumbers.mockResolvedValue(
        [
          { getNumbers: jest.fn().mockReturnValue("1001") },
        ] as unknown as TransportationNumber[]
      );

      const errorResponse = ErrorResponseDto.of<SubwayArrivalInfo>(
        ErrorCode.NOT_FOUND_SUBWAY_ARRIVAL_INFO
      );
      jest
        .spyOn(trafficService as any, "bringMainSubwayArrivalInfo")
        .mockRejectedValue(errorResponse);

      const result = await trafficService.bringMainTrafficCollection(userId);

      expect(result.collection).toBeDefined();
      expect(result.result.getSubwayErrorMessage()).toBe(
        errorResponse.getMessage()
      );
      expect(result.result.getBusStations()).toBeUndefined();
      expect(result.result.getSubwayStation()).toBeUndefined();
    });

    it("should handle ErrorResponseDto for Subway arrival info not found 3", async () => {
      const userId = 1;
      mockCurrentTime(23);
      const mockCollection = {
        trafficCollectionDetails: [
          {
            getStatus: jest.fn().mockReturnValue("goToWork"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Subway"),
                getStationName: jest.fn().mockReturnValue("Station 1"),
                getId: jest.fn().mockReturnValue(1),
              },
            ],
          },
          {
            getStatus: jest.fn().mockReturnValue("goHome"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Subway"),
                getStationName: jest.fn().mockReturnValue("Station 2"),
                getId: jest.fn().mockReturnValue(2),
              },
            ],
          },
        ],
      } as unknown as TrafficCollection;

      trafficCollectionRepository.findMainTrafficCollection.mockResolvedValueOnce(
        mockCollection
      );
      transportationNumberRepository.findTransportationNumbers.mockResolvedValue(
        [
          { getNumbers: jest.fn().mockReturnValue("1001") },
        ] as unknown as TransportationNumber[]
      );

      const errorResponse = ErrorResponseDto.of<SubwayArrivalInfo>(
        ErrorCode.NOT_FOUND_SUBWAY_ARRIVAL_INFO
      );
      jest
        .spyOn(trafficService as any, "bringMainSubwayArrivalInfo")
        .mockRejectedValue(errorResponse);

      const result = await trafficService.bringMainTrafficCollection(userId);

      expect(result.collection).toBeDefined();
      expect(result.result.getSubwayErrorMessage()).toBe(
        errorResponse.getMessage()
      );
      expect(result.result.getBusStations()).toBeUndefined();
      expect(result.result.getSubwayStation()).toBeUndefined();
    });

    it("should handle Bus transportation and return BusStationResult 1", async () => {
      mockCurrentTime(15);
      const userId = 1;
      const mockCollection = {
        trafficCollectionDetails: [
          {
            getStatus: jest.fn().mockReturnValue("goToWork"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Bus"),
                getStationName: jest.fn().mockReturnValue("Station 1"),
                getId: jest.fn().mockReturnValue(1),
              },
            ],
          },
          {
            getStatus: jest.fn().mockReturnValue("goHome"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Bus"),
                getStationName: jest.fn().mockReturnValue("Station 2"),
                getId: jest.fn().mockReturnValue(2),
              },
            ],
          },
        ],
      } as unknown as TrafficCollection;

      trafficCollectionRepository.findMainTrafficCollection.mockResolvedValueOnce(
        mockCollection
      );
      transportationNumberRepository.findTransportationNumbers.mockResolvedValue(
        [
          { getNumbers: jest.fn().mockReturnValue("1001") },
        ] as unknown as TransportationNumber[]
      );
      const mockBusStations = [
        { stationName: "Station 1", busArrivalInfo: [] },
      ] as unknown as BusStationInfo[];
      jest
        .spyOn(trafficService as any, "bringMainBusStationsInfo")
        .mockResolvedValue(mockBusStations);

      const result = await trafficService.bringMainTrafficCollection(userId);

      expect(result.collection).toBeDefined();
      expect(result.result.getBusStations).toBeDefined();
      expect(result.result.getSubwayStation()).toBeUndefined();
    });

    it("should handle Bus transportation and return BusStationResult 2", async () => {
      mockCurrentTime(10);
      const userId = 1;
      const mockCollection = {
        trafficCollectionDetails: [
          {
            getStatus: jest.fn().mockReturnValue("goToWork"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Bus"),
                getStationName: jest.fn().mockReturnValue("Station 1"),
                getId: jest.fn().mockReturnValue(1),
              },
            ],
          },
          {
            getStatus: jest.fn().mockReturnValue("goHome"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Bus"),
                getStationName: jest.fn().mockReturnValue("Station 2"),
                getId: jest.fn().mockReturnValue(2),
              },
            ],
          },
        ],
      } as unknown as TrafficCollection;

      trafficCollectionRepository.findMainTrafficCollection.mockResolvedValueOnce(
        mockCollection
      );
      transportationNumberRepository.findTransportationNumbers.mockResolvedValue(
        [
          { getNumbers: jest.fn().mockReturnValue("1001") },
        ] as unknown as TransportationNumber[]
      );
      const mockBusStations = [
        { stationName: "Station 1", busArrivalInfo: [] },
      ] as unknown as BusStationInfo[];
      jest
        .spyOn(trafficService as any, "bringMainBusStationsInfo")
        .mockResolvedValue(mockBusStations);

      const result = await trafficService.bringMainTrafficCollection(userId);

      expect(result.collection).toBeDefined();
      expect(result.result.getBusStations).toBeDefined();
      expect(result.result.getSubwayStation()).toBeUndefined();
    });

    it("should handle Bus transportation and return BusStationResult 1", async () => {
      mockCurrentTime(23);
      const userId = 1;
      const mockCollection = {
        trafficCollectionDetails: [
          {
            getStatus: jest.fn().mockReturnValue("goToWork"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Bus"),
                getStationName: jest.fn().mockReturnValue("Station 1"),
                getId: jest.fn().mockReturnValue(1),
              },
            ],
          },
          {
            getStatus: jest.fn().mockReturnValue("goHome"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Bus"),
                getStationName: jest.fn().mockReturnValue("Station 2"),
                getId: jest.fn().mockReturnValue(2),
              },
            ],
          },
        ],
      } as unknown as TrafficCollection;

      trafficCollectionRepository.findMainTrafficCollection.mockResolvedValueOnce(
        mockCollection
      );
      transportationNumberRepository.findTransportationNumbers.mockResolvedValue(
        [
          { getNumbers: jest.fn().mockReturnValue("1001") },
        ] as unknown as TransportationNumber[]
      );
      const mockBusStations = [
        { stationName: "Station 1", busArrivalInfo: [] },
      ] as unknown as BusStationInfo[];
      jest
        .spyOn(trafficService as any, "bringMainBusStationsInfo")
        .mockResolvedValue(mockBusStations);

      const result = await trafficService.bringMainTrafficCollection(userId);

      expect(result.collection).toBeDefined();
      expect(result.result.getBusStations).toBeDefined();
      expect(result.result.getSubwayStation()).toBeUndefined();
    });
  });

  describe("changeTrafficRoute function test", () => {
    it("should handle subwayarrinfo when currentStatus is goToWork", async () => {
      const userId = 1;
      const currentStatus = "goToWork";
      const newStatus = currentStatus === "goToWork" ? "goHome" : "goToWork";
      const mockCollection = {
        trafficCollectionDetails: [
          {
            getStatus: jest.fn().mockReturnValue("goToWork"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Subway"),
                getStationName: jest.fn().mockReturnValue("Station 1"),
                getId: jest.fn().mockReturnValue(1),
              },
            ],
          },
          {
            getStatus: jest.fn().mockReturnValue("goHome"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Subway"),
                getStationName: jest.fn().mockReturnValue("Station 2"),
                getId: jest.fn().mockReturnValue(2),
              },
            ],
          },
        ],
      } as unknown as TrafficCollection;
      trafficCollectionRepository.findMainTrafficCollection.mockResolvedValueOnce(
        mockCollection
      );
      transportationNumberRepository.findTransportationNumbers.mockResolvedValue(
        [
          { getNumbers: jest.fn().mockReturnValue("1001") },
        ] as unknown as TransportationNumber[]
      );
      const subwayArrivalInfo = [] as SubwayArrivalInfo[];
      jest
        .spyOn(trafficService as any, "bringMainSubwayArrivalInfo")
        .mockResolvedValue(subwayArrivalInfo);
      const result = await trafficService.changeTrafficRoute(
        userId,
        currentStatus
      );
      expect(result.collection).toBeDefined();
      expect(result.result).toBeDefined();
      expect(
        trafficCollectionRepository.findMainTrafficCollection
      ).toHaveBeenCalledWith(userId, newStatus); //14시 이전엔 goToWork, 14시 이후엔 goHome으로 테스트 해야함.
      expect(trafficService["bringMainSubwayArrivalInfo"]).toHaveBeenCalledWith(
        expect.anything(),
        ["1001"]
      );
    });

    it("should handle subwayarrinfo when currentStatus is goHome", async () => {
      const userId = 1;
      const currentStatus = "goHome";
      const newStatus = currentStatus === "goHome" ? "goToWork" : "goHome";
      const mockCollection = {
        trafficCollectionDetails: [
          {
            getStatus: jest.fn().mockReturnValue("goToWork"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Subway"),
                getStationName: jest.fn().mockReturnValue("Station 1"),
                getId: jest.fn().mockReturnValue(1),
              },
            ],
          },
          {
            getStatus: jest.fn().mockReturnValue("goHome"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Subway"),
                getStationName: jest.fn().mockReturnValue("Station 2"),
                getId: jest.fn().mockReturnValue(2),
              },
            ],
          },
        ],
      } as unknown as TrafficCollection;
      trafficCollectionRepository.findMainTrafficCollection.mockResolvedValueOnce(
        mockCollection
      );
      transportationNumberRepository.findTransportationNumbers.mockResolvedValue(
        [
          { getNumbers: jest.fn().mockReturnValue("1001") },
        ] as unknown as TransportationNumber[]
      );
      const subwayArrivalInfo = [] as SubwayArrivalInfo[];
      jest
        .spyOn(trafficService as any, "bringMainSubwayArrivalInfo")
        .mockResolvedValue(subwayArrivalInfo);
      const result = await trafficService.changeTrafficRoute(
        userId,
        currentStatus
      );
      expect(result.collection).toBeDefined();
      expect(result.result).toBeDefined();
      expect(
        trafficCollectionRepository.findMainTrafficCollection
      ).toHaveBeenCalledWith(userId, newStatus);
      expect(trafficService["bringMainSubwayArrivalInfo"]).toHaveBeenCalledWith(
        expect.anything(),
        ["1001"]
      );
    });

    it("should handle ErrorResponseDto for Subway arrival info not found when currentStatus is goToWork", async () => {
      const userId = 1;
      const currentStatus = "goToWork";
      const newStatus = currentStatus === "goToWork" ? "goHome" : "goToWork";
      const mockCollection = {
        trafficCollectionDetails: [
          {
            getStatus: jest.fn().mockReturnValue("goToWork"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Subway"),
                getStationName: jest.fn().mockReturnValue("Station 1"),
                getId: jest.fn().mockReturnValue(1),
              },
            ],
          },
          {
            getStatus: jest.fn().mockReturnValue("goHome"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Subway"),
                getStationName: jest.fn().mockReturnValue("Station 2"),
                getId: jest.fn().mockReturnValue(2),
              },
            ],
          },
        ],
      } as unknown as TrafficCollection;

      trafficCollectionRepository.findMainTrafficCollection.mockResolvedValueOnce(
        mockCollection
      );
      transportationNumberRepository.findTransportationNumbers.mockResolvedValue(
        [
          { getNumbers: jest.fn().mockReturnValue("1001") },
        ] as unknown as TransportationNumber[]
      );

      const errorResponse = ErrorResponseDto.of<SubwayArrivalInfo>(
        ErrorCode.NOT_FOUND_SUBWAY_ARRIVAL_INFO
      );
      jest
        .spyOn(trafficService as any, "bringMainSubwayArrivalInfo")
        .mockRejectedValue(errorResponse);
      const result = await trafficService.changeTrafficRoute(
        userId,
        currentStatus
      );
      expect(result.collection).toBeDefined();
      expect(result.result.getSubwayErrorMessage()).toBe(
        errorResponse.getMessage()
      );
      expect(result.result.getBusStations()).toBeUndefined();
      expect(result.result.getSubwayStation()).toBeUndefined();
    });

    it("should handle ErrorResponseDto for Subway arrival info not found when currentStatus is goHome", async () => {
      const userId = 1;
      const currentStatus = "goHome";
      const newStatus = currentStatus === "goHome" ? "goToWork" : "goHome";
      const mockCollection = {
        trafficCollectionDetails: [
          {
            getStatus: jest.fn().mockReturnValue("goToWork"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Subway"),
                getStationName: jest.fn().mockReturnValue("Station 1"),
                getId: jest.fn().mockReturnValue(1),
              },
            ],
          },
          {
            getStatus: jest.fn().mockReturnValue("goHome"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Subway"),
                getStationName: jest.fn().mockReturnValue("Station 2"),
                getId: jest.fn().mockReturnValue(2),
              },
            ],
          },
        ],
      } as unknown as TrafficCollection;

      trafficCollectionRepository.findMainTrafficCollection.mockResolvedValueOnce(
        mockCollection
      );
      transportationNumberRepository.findTransportationNumbers.mockResolvedValue(
        [
          { getNumbers: jest.fn().mockReturnValue("1001") },
        ] as unknown as TransportationNumber[]
      );

      const errorResponse = ErrorResponseDto.of<SubwayArrivalInfo>(
        ErrorCode.NOT_FOUND_SUBWAY_ARRIVAL_INFO
      );
      jest
        .spyOn(trafficService as any, "bringMainSubwayArrivalInfo")
        .mockRejectedValue(errorResponse);
      const result = await trafficService.changeTrafficRoute(
        userId,
        currentStatus
      );
      expect(result.collection).toBeDefined();
      expect(result.result.getSubwayErrorMessage()).toBe(
        errorResponse.getMessage()
      );
      expect(result.result.getBusStations()).toBeUndefined();
      expect(result.result.getSubwayStation()).toBeUndefined();
    });

    it("should busarrInfo whern currentStatus is goToWork", async () => {
      const userId = 1;
      const currentStatus = "goToWork";
      const newStatus = currentStatus === "goToWork" ? "goHome" : "goToWork";
      const mockCollection = {
        trafficCollectionDetails: [
          {
            getStatus: jest.fn().mockReturnValue("goToWork"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Bus"),
                getStationName: jest.fn().mockReturnValue("Station 1"),
                getId: jest.fn().mockReturnValue(1),
              },
            ],
          },
          {
            getStatus: jest.fn().mockReturnValue("goHome"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Bus"),
                getStationName: jest.fn().mockReturnValue("Station 2"),
                getId: jest.fn().mockReturnValue(2),
              },
            ],
          },
        ],
      } as unknown as TrafficCollection;
      trafficCollectionRepository.findMainTrafficCollection.mockResolvedValueOnce(
        mockCollection
      );
      transportationNumberRepository.findTransportationNumbers.mockResolvedValue(
        [
          { getNumbers: jest.fn().mockReturnValue("123") },
        ] as unknown as TransportationNumber[]
      );
      const busStationInfo = [] as BusStationInfo[];
      jest
        .spyOn(trafficService as any, "bringMainBusStationsInfo")
        .mockResolvedValue(busStationInfo);
      const result = await trafficService.changeTrafficRoute(
        userId,
        currentStatus
      );
      expect(result.collection).toBeDefined();
      expect(result.result).toBeDefined();
      expect(
        trafficCollectionRepository.findMainTrafficCollection
      ).toHaveBeenCalledWith(userId, newStatus); // 14시 이전엔 goToWork, 14시 이후엔 goHome으로 테스트 해야함.
      expect(trafficService["bringMainBusStationsInfo"]).toHaveBeenCalledWith(
        expect.anything(),
        ["123"]
      );
    });

    it("should busarrInfo whern currentStatus is goHome", async () => {
      const userId = 1;
      const currentStatus = "goHome";
      const newStatus = currentStatus === "goHome" ? "goToWork" : "goHome";
      const mockCollection = {
        trafficCollectionDetails: [
          {
            getStatus: jest.fn().mockReturnValue("goToWork"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Bus"),
                getStationName: jest.fn().mockReturnValue("Station 1"),
                getId: jest.fn().mockReturnValue(1),
              },
            ],
          },
          {
            getStatus: jest.fn().mockReturnValue("goHome"),
            transportations: [
              {
                getRoute: jest.fn().mockReturnValue("departure"),
                getTransportationName: jest.fn().mockReturnValue("Bus"),
                getStationName: jest.fn().mockReturnValue("Station 2"),
                getId: jest.fn().mockReturnValue(2),
              },
            ],
          },
        ],
      } as unknown as TrafficCollection;
      trafficCollectionRepository.findMainTrafficCollection.mockResolvedValueOnce(
        mockCollection
      );
      transportationNumberRepository.findTransportationNumbers.mockResolvedValue(
        [
          { getNumbers: jest.fn().mockReturnValue("123") },
        ] as unknown as TransportationNumber[]
      );
      const busStationInfo = [] as BusStationInfo[];
      jest
        .spyOn(trafficService as any, "bringMainBusStationsInfo")
        .mockResolvedValue(busStationInfo);
      const result = await trafficService.changeTrafficRoute(
        userId,
        currentStatus
      );
      expect(result.collection).toBeDefined();
      expect(result.result).toBeDefined();
      expect(
        trafficCollectionRepository.findMainTrafficCollection
      ).toHaveBeenCalledWith(userId, newStatus); // 14시 이전엔 goToWork, 14시 이후엔 goHome으로 테스트 해야함.
      expect(trafficService["bringMainBusStationsInfo"]).toHaveBeenCalledWith(
        expect.anything(),
        ["123"]
      );
    });
  });

  describe("bringMainSubwayArrivalInfo function test", () => {
    it("basic", async () => {
      const departureTransportation = {
        getStationName: jest.fn().mockReturnValue("녹사평"),
      } as unknown as Transportation;
      const bringMainSubwayArrivalInfoResponse = [{}] as SubwayArrivalInfo[];
      const numbers = ["1006"];
      const mockSubwayArrivalInfo = [
        {
          statnNm: "녹사평",
          subwayId: 1006,
          trainLineNm: "응암순환 - 방면",
          arvlMsg2: "4분 후 (한강진)",
          arvlMsg3: "한강진",
          bstatnNm: "응암순환(상선)",
          barvlDt: 240,
        },
      ];
      const bringSubwayArrivalInfoSpy = jest
        .spyOn(trafficService, "bringSubwayArrivalInfo")
        .mockResolvedValue(mockSubwayArrivalInfo);
      const result = await (trafficService as any).bringMainSubwayArrivalInfo(
        departureTransportation,
        numbers
      );
      expect(result).toEqual(bringMainSubwayArrivalInfoResponse);
      expect(bringSubwayArrivalInfoSpy).toHaveBeenCalledWith(
        departureTransportation.getStationName(),
        numbers
      );
    });
  });

  describe("bringMainBusStationsInfo function test", () => {
    it("basic", async () => {
      const departureTransportation = {
        getStationName: jest.fn().mockReturnValue("Station B"),
      } as unknown as Transportation;
      const bringBusArrivalInfoResponse = [
        { busArrivalInfo: [], station: undefined },
      ] as unknown as BusStation[];
      const numbers = ["100", "200"];
      const mockBusStations = [
        { getStationNum: jest.fn().mockReturnValue(1) },
      ] as unknown as BusStation[];
      const mockBusArrivalInfo = [] as BusArrivalInfo[];
      busStationRepository.findByStationName.mockResolvedValue(mockBusStations);
      const bringBusARrivalInfoSpy = jest
        .spyOn(trafficService, "bringBusArrivalInfo")
        .mockResolvedValue(mockBusArrivalInfo);
      const result = await (trafficService as any).bringMainBusStationsInfo(
        departureTransportation,
        numbers
      );
      expect(result).toEqual(bringBusArrivalInfoResponse);
      expect(busStationRepository.findByStationName).toHaveBeenCalledWith(
        "Station B"
      );
      expect(bringBusARrivalInfoSpy).toHaveBeenCalledWith(1, numbers);
    });
  });

  describe("verifyInsertTrafficCollectionStatus function test", () => {
    it("basic", async () => {
      const collectionInsert = {
        getGoToWork: jest.fn().mockReturnValue({
          status: "goToWork",
          departure: {
            name: "Station A",
            type: "subway",
            route: "Line 1",
            numbers: ["1001"],
          },
          arrival: {
            name: "Station B",
            type: "subway",
            route: "Line 1",
            numbers: ["1002"],
          },
        } as unknown as TransportationDetailDto),
        getGoHome: jest.fn().mockReturnValue({
          status: "goHome",
          departure: {
            name: "Station C",
            type: "bus",
            route: "Route 1",
            numbers: ["2001"],
          },
          arrival: {
            name: "Station D",
            type: "bus",
            route: "Route 1",
            numbers: ["2002"],
          },
        } as unknown as TransportationDetailDto),
      } as unknown as CollectionInsert;

      const trafficCollection = {} as TrafficCollection;
      const penetrateSpy = jest
        .spyOn(trafficService as any, "penetrateTrafficCollectionDetail")
        .mockResolvedValue(null);
      await trafficService.verifyInsertTrafficCollectionStatus(
        collectionInsert,
        trafficCollection
      );
      expect(penetrateSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("verifyUpdateTrafficCollectionStatus function test", () => {
    it("basic", async () => {
      const collectionDetailUpdate = {
        getGoToWork: jest.fn().mockReturnValue({
          status: "goToWork",
          departure: {
            name: "Station A",
            type: "subway",
            route: "Line 1",
            numbers: ["1001"],
          },
          arrival: {
            name: "Station B",
            type: "subway",
            route: "Line 1",
            numbers: ["1002"],
          },
        } as unknown as TransportationDetailDto),
        getGoHome: jest.fn().mockReturnValue({
          status: "goHome",
          departure: {
            name: "Station C",
            type: "bus",
            route: "Route 1",
            numbers: ["2001"],
          },
          arrival: {
            name: "Station D",
            type: "bus",
            route: "Route 1",
            numbers: ["2002"],
          },
        } as unknown as TransportationDetailDto),
      } as unknown as CollectionDetailUpdate;

      const trafficCollection = {} as TrafficCollection;
      const penetrateSpy = jest
        .spyOn(trafficService as any, "penetrateTrafficCollectionDetail")
        .mockResolvedValue(null);
      await trafficService.verifyUpdateTrafficCollectionStatus(
        collectionDetailUpdate,
        trafficCollection
      );
      expect(penetrateSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("bringSubwayArrivalInfo function test", () => {
    it("basic", async () => {
      const stationName = "녹사평역";
      const numbers = ["1001", "1002"];
      const arrivalList = [
        {
          statnNm: "녹사평역",
          subwayId: "1001",
          trainLineNm: "Station - C",
          arvlMsg2: "string",
          arvlMsg3: "string",
          bstatnNm: "string",
          barvlDt: 5,
        },
        {
          statnNm: "녹사평역",
          subwayId: "1003",
          trainLineNm: "Station - C",
          arvlMsg2: "string",
          arvlMsg3: "string",
          bstatnNm: "string",
          barvlDt: 5,
        },
      ];
      subwayApi.bringSubwayArrivalInfo.mockResolvedValue(arrivalList);
      const result = await trafficService.bringSubwayArrivalInfo(
        stationName,
        numbers
      );
      expect(result.length).toBe(1);
      expect(subwayApi.bringSubwayArrivalInfo).toHaveBeenCalledWith("녹사평역");
      expect(result[0].getLine()).toBe("1001");
    });
  });

  describe("bringBusArrivalInfo function test", () => {
    it("basic", async () => {
      const stationNum = 101;
      const numbers = ["100", "200"];
      const busArrivalList = [{ busRouteAbrv: "100" }, { busRouteAbrv: "300" }];
      busApi.bringBusArrivalInfo.mockResolvedValue(busArrivalList);
      const result = await trafficService.bringBusArrivalInfo(
        stationNum,
        numbers
      );
      expect(result.length).toBe(1);
      expect(result[0].getBusRouteAbrv()).toBe("100");
    });
  });
});
