import { getConnection } from 'typeorm';
import { SubwayStation } from '../entity/SubwayStation'; // SubwayStation 엔티티 경로를 맞춰주세요.
import * as fs from 'fs';
import * as readline from 'readline';

class SubwayStationImportService {
  async importSubwayStations(filepath: string): Promise<void> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const subwayStationRepository = queryRunner.manager.getRepository(SubwayStation);
      const fileStream = fs.createReadStream(filepath, { encoding: 'utf-8' });
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      let isFirstLine = true;
      let lineNumber = 0;

      for await (const line of rl) {
        lineNumber++;
        if (isFirstLine) {
          isFirstLine = false;
          continue;
        }

        const row = line.split(',');
        const subwayStation = SubwayStation.createSubwayStation(
            undefined, // id는 자동 생성되므로 undefined
            row[0], // subwayName
            Number(row[3]), // xValue
            Number(row[2])  // yValue
        );

        try {
          await subwayStationRepository.save(subwayStation);
        } catch (error) {
          console.error(`Error saving line ${lineNumber}:`, error, row);
        }
      }

      await queryRunner.commitTransaction();
      console.log('CSV 데이터가 성공적으로 저장되었습니다!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('데이터 가져오는 중 오류 발생:', error);
    } finally {
      await queryRunner.release();
    }
  }
}

export default new SubwayStationImportService();
