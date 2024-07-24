import { Service } from "typedi";
import { UserRepository } from "../repository/User.Repository.js";
import { TrafficCollectionRepository } from "../repository/TrafficCollection.Repository.js";
import { CollectionInsert } from "../dto/request/CollectionInsert.js";
import { InjectRepository } from "typeorm-typedi-extensions";
import { TrafficRepository } from "../repository/Traffic.Repository.js";
import { CollectionUpdate } from "../dto/request/CollectionUpdate.js";

@Service()
export class TrafficService {

    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository,
        @InjectRepository(TrafficRepository) private trafficRepository: TrafficRepository,
        @InjectRepository(TrafficCollectionRepository) private trafficCollectionRepository: TrafficCollectionRepository
    ) { }

    async penetrateTrafficCollection(collectionInsert: CollectionInsert, userId: number) {

        await this.trafficRepository.insertTrafficCollection(collectionInsert, userId);
    }

    async eraseTrafficCollection(userId: number, collectionId: number) {
        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        await this.trafficCollectionRepository.deleteTrafficCollection(collectionId, user);
    }

    async modifyTrafficCollection(collectionUpdate: CollectionUpdate, userId: number) {
        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        await this.trafficCollectionRepository.updateTrafficCollection(collectionUpdate, user);
    }

    async bringTrafficCollectionsByUserId(userId: number) {
        const userCollections = await this.trafficCollectionRepository.find({
            where: { user: { id: userId } },
            relations: ["trafficCollectionDetails", "trafficCollectionDetails.transportations"]
        });

        return userCollections.map(collection => ({
            name: collection.name,
            details: collection.trafficCollectionDetails.map(detail => ({
                status: detail.status,
                stations: detail.transportations.map(transportation => ({
                    stationName: transportation.stationName
                }))
            }))
        }));
    }

    async bringTrafficCollectionDetailsById(collectionId: number) {
        const collection = await this.trafficCollectionRepository.findOne({
            where: { id: collectionId },
            relations: ["trafficCollectionDetails", "trafficCollectionDetails.transportations"]
        });

        if (!collection) {
            throw new Error("Traffic collection not found");
        }

        return {
            name: collection.name,
            details: collection.trafficCollectionDetails.map(detail => ({
                status: detail.status,
                stations: detail.transportations.map(transportation => ({
                    stationName: transportation.stationName
                }))
            }))
        };
    }

}