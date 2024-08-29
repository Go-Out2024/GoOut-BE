
import { Service } from 'typedi';
import { Connection } from 'typeorm';


@Service()
export class AlarmRepository{
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    public async findDataForAlarm() {
        return this.connection.query(
            `
            SELECT *
            FROM user AS u
            INNER JOIN firebase_token AS ft ON ft.user_id = u.id 
            WHERE u.alarm = 1 AND CURRENT_TIME BETWEEN u.alarm_start AND u.alarm_end
            `
        );
    }
}

// INNER JOIN traffic_collection AS tc ON tc.user_id = u.id AND tc.choice = 1
// INNER JOIN traffic_collection_detail AS tcd ON tcd.traffic_collection_id = tc.id
// AND tcd.status = 
//     CASE 
//         WHEN CURRENT_TIME < '14:00:00' THEN 'goToWork'
//         ELSE 'goHome'
//     END
// INNER JOIN transportation as t ON t.traffic_collection_detail_id = tcd.id and t.route = 'departure'