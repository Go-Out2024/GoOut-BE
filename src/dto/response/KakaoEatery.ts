import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export class KakaoEatery{

    private distance: number;
    private placeName: string;
    private placeUrl: string;


    constructor(distance:number, placeName: string, placeUrl: string){
        this.setDistance(distance);
        this.setPlaceName(placeName);
        this.setPlaceUrl(placeUrl);
    }

    public static of(distance:number, placeName: string, placeUrl: string){
        return new KakaoEatery(distance, placeName, placeUrl);
    }


    private setDistance(distance: number){
        if(distance === null) throw new Error (`${__dirname} : distance 값이 존재하지 않습니다.`);
        this.distance=distance;
    }

    private setPlaceName(placeName: string){
        if(placeName === null) throw new Error (`${__dirname} : placeName 값이 존재하지 않습니다.`);
        this.placeName=placeName;
    }

    private setPlaceUrl(placeUrl: string){
        if(placeUrl === null) throw new Error (`${__dirname} : placeUrl 값이 존재하지 않습니다.`);
        this.placeUrl=placeUrl;
    }
}