import { EntityRepository, Repository } from "typeorm";
import { TransportationNumber } from "../entity/TransportationNumber.js";
import { Transportation } from "../entity/Transportation.js";

@EntityRepository(TransportationNumber)
export class TransportationNumberRepository extends Repository<TransportationNumber> {

    /**
     * 교통 수단 번호 등록 함수
     * @param numbers 교통 수단 번호 배열
     * @param transportation 교통 수단
     * @returns 
     */
    async insertTransportationNumbers(numbers: string[], transportation: Transportation): Promise<TransportationNumber[]> {
        const transportationNumbers = numbers.map(number => {
            const transportationNumber = TransportationNumber.createTransportationNumber(
                number,
                transportation.id
            );
            return transportationNumber;
        });
        await this.save(transportationNumbers);
        return transportationNumbers;
    }

    /**
     * 교통수단 아이디를 이용하여 해당 역의 호선 번호 또는 버스 번호 조회
     * @param transportationId 교통수단 아이디
     * @returns 
     */
    async findTransportationNumbers(transportationId: number): Promise<TransportationNumber[]> {
        return await this.createQueryBuilder("transportationNumber")
            .where("transportationNumber.transportation_id = :transportationId", { transportationId })
            .select("transportationNumber.numbers")
            .getMany();
    }
}
