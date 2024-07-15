import { getRepository } from "typeorm";
import { BusStation } from "../entity/BusStation";
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

class BusStationImportService {
    async importBusstation(filepath: string): Promise<void> {
        try {
            const busStationRepository = getRepository(BusStation);
            const fileStream = fs.createReadStream(filepath, {encoding: "utf-8"});
            const r1 = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            let isFirstLine = true;
            for await (const line of r1) {
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

                await busStationRepository.save(busStation);
            }

            console.log("Data imported successfully!");
        } catch(error) {
            console.error("Error importing data:", error);
        }
    }
}

export default new BusStationImportService();