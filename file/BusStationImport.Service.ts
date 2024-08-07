import { getRepository, getConnection } from "typeorm";
import { BusStation } from "../src/entity/BusStation.js";
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

class BusStationImportService {
    async importBusstation(filepath: string): Promise<void> {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            const busStationRepository = queryRunner.manager.getRepository(BusStation);
            const fileStream = fs.createReadStream(filepath, {encoding: "utf-8"});
            const r1 = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            let isFirstLine = true;
            let lineNumber = 0;

            for await (const line of r1) {
                lineNumber++;
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }

                const row = line.split(',');
                const busStation = new BusStation();
                busStation.id = Number(row[0]);
                busStation.stationNum = Number(row[1]);
                busStation.stationName = row[2];
                busStation.xValue = Number(row[3]);
                busStation.yValue = Number(row[4]);

                try {
                    await busStationRepository.save(busStation);
                } catch (error) {
                    console.error(`Error saving line ${lineNumber}:`, error, row);
                }
            }

            await queryRunner.commitTransaction();
            console.log("Data imported successfully!");
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error("Error importing data:", error);
        } finally {
            await queryRunner.release();
        }
    }
}

export default new BusStationImportService();
