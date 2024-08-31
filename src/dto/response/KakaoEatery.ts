

export class KakaoEatery{

    private distance: number;
    private placeName: string;
    private placeUrl: string;
    private phone:string;
    private roadAddressName:string;


    constructor(distance:number, placeName: string, placeUrl: string, phone:string, roadAddressName:string){
        this.setDistance(distance);
        this.setPlaceName(placeName);
        this.setPlaceUrl(placeUrl);
        this.setPhone(phone);
        this.setRoadAddressName(roadAddressName);
    }

    public static of(distance:number, placeName: string, placeUrl: string, phone:string, roadAddressName:string){
        return new KakaoEatery(distance, placeName, placeUrl, phone, roadAddressName);
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

    private setPhone(phone:string){
        if(phone === null) throw new Error (`${__dirname} : phone 값이 존재하지 않습니다.`);
        this.phone=phone;
    }

    private setRoadAddressName(roadAddressName:string){
        if(roadAddressName === null) throw new Error (`${__dirname} : roadAddressName 값이 존재하지 않습니다.`);
        this.roadAddressName=roadAddressName;
    }
}