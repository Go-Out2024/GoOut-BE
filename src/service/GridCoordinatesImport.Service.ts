import { getRepository } from 'typeorm';
import csv from 'csv-parser';
import * as fs from 'fs';
import { GridCoordinates } from '../entity/GridCoordinates.js';

export default class GridCoordinatesImportService {
    public static async importGridCoordinates(filePath: string): Promise<void> {
        const repository = getRepository(GridCoordinates);
        const records: any[] = [];

        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => {
                    records.push({
                        regionCode: data['행정구역코드'],
                        level1: data['1단계'],
                        level2: data['2단계'],
                        level3: data['3단계'],
                        gridX: parseInt(data['격자 X']),
                        gridY: parseInt(data['격자 Y']),
                        longitude: parseFloat(data['경도(초/100)']),
                        latitude: parseFloat(data['위도(초/100)']),
                    });
                })
                .on('end', async () => {
                    await repository.save(records);
                    resolve();
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    }
}
