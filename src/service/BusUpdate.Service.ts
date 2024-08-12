import { getRepository, getConnection } from "typeorm";
import { Bus } from "../entity/Bus.js";
import * as fs from 'fs';
import * as readline from 'readline';

class BusSequenceUpdateService {
    async updateBusSequence(filepath: string): Promise<void> {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const busRepository = queryRunner.manager.getRepository(Bus);

            const fileStream = fs.createReadStream(filepath, { encoding: "utf-8" });
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            let isFirstLine = true;
            let lineNumber = 0;

            for await (const line of rl) {
                lineNumber++;
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;  // 첫 번째 줄은 건너뜁니다 (헤더).
                }

                const row = line.split(',');

                const busId = Number(row[0]);
                const busName = row[1];
                const sequenceValue = Number(row[2]);
                const busStationId = Number(row[3]);

                if (isNaN(sequenceValue)) {
                    console.warn(`Invalid sequence number at line ${lineNumber}:`, row[2]);
                    continue; // 잘못된 sequence 값을 건너뜁니다.
                }

                // busId, busName, busStationId로 버스 조회하여 sequence 업데이트
                const bus = await busRepository.findOne({
                    where: { busId: busId, busName: busName, busStation: { id: busStationId } }
                });

                if (bus) {
                    bus.sequence = sequenceValue;

                    try {
                        await busRepository.save(bus);
                    } catch (error) {
                        console.error(`Error updating sequence at line ${lineNumber}:`, error, row);
                    }
                } else {
                    console.warn(`Bus with ID ${busId}, name ${busName}, and station ID ${busStationId} not found at line ${lineNumber}`);
                }
            }

            await queryRunner.commitTransaction();
            console.log("Bus sequence updated successfully!");
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error("Error updating bus sequence:", error);
        } finally {
            await queryRunner.release();
        }
    }
}

export default new BusSequenceUpdateService();
