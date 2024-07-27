import { EntityRepository, Repository } from "typeorm";
import { TrafficCollection } from "../entity/TrafficCollection.js";
import { User } from "../entity/User.js";

@EntityRepository(TrafficCollection)
export class TrafficCollectionDeleteRepository extends Repository<TrafficCollection> {

    /**
     * 교통 컬렉션 삭제 함수
     * @param collectionId 교통 컬렉션 id
     * @param user 해당 유저
     */
    async deleteTrafficCollection(collectionId: number, user: User) {
        
        const trafficCollection = await this.findOne({ where: { id: collectionId, user: user } });
        if (!trafficCollection) {
            throw new Error('해당 교통 컬렉션 아이디가 존재하지 않습니다.');
        }

        await this.remove(trafficCollection);
    }
}