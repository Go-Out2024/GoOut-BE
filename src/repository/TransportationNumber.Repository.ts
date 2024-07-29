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
            transportationNumber.transportation = transportation;
            return transportationNumber;
        });

        await this.save(transportationNumbers);

        return transportationNumbers;
    }
}
