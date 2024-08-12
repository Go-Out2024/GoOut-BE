import { getRepository, getConnection } from "typeorm";
import { Bus } from "../entity/Bus";
import { BusStation } from "../entity/BusStation";
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

class BusImportService {
    async importBusData(filepath: string): Promise<void> {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const busRepository = queryRunner.manager.getRepository(Bus);
            const busStationRepository = queryRunner.manager.getRepository(BusStation);

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
                const busStationId = Number(row[3]);

                // BusStation이 존재하는지 확인
                const busStation = await busStationRepository.findOne({ where: { id: busStationId } });

                if (busStation) {
                    const bus = new Bus();
                    bus.busId = Number(row[0]);
                    bus.busName = row[1];
                    bus.sequence = Number(row[2]);
                    bus.busStation = busStation;

                    try {
                        await busRepository.save(bus);
                    } catch (error) {
                        console.error(`Error saving line ${lineNumber}:`, error, row);
                    }
                } else {
                    console.warn(`Bus station ID ${busStationId} not found at line ${lineNumber}`);
                }
            }

            await queryRunner.commitTransaction();
            console.log("Bus data imported successfully!");
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error("Error importing bus data:", error);
        } finally {
            await queryRunner.release();
        }
    }
}

export default new BusImportService();
