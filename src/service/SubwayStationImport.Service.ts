import { getRepository } from "typeorm";
import { SubwayStation } from "../entity/SubwayStation.js";
import * as fs from 'fs';
import * as readline from 'readline';

class SubwayStationImportService {
    async importSubwayStations(filepath: string): Promise<void> {
        try {
            const subwayStationRepository = getRepository(SubwayStation);
            const fileStream = fs.createReadStream(filepath, { encoding: "utf-8" });
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            let isFirstLine = true;
            for await (const line of rl) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }

                const row = line.split(',');
                const subwayStation = new SubwayStation();
                subwayStation.id = Number(row[2]);  // 고유역 번호
                subwayStation.subwayName = row[3];  // 역명
                subwayStation.xValue = Number(row[5]); // 경도
                subwayStation.yValue = Number(row[4]); // 위도

                await subwayStationRepository.save(subwayStation);
            }

            console.log("Data imported successfully!");
        } catch (error) {
            console.error("Error importing data:", error);
        }
    }
}

export default new SubwayStationImportService();