import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export class Music{


    private music: string;
    private singer: string;
    private url:string;


    constructor(music: string, singer:string, url:string){
   
        this.setPlaceUrl(music);
        this.setPhone(singer);
        this.setRoadAddressName(url);
    }

    public static of(music: string, singer:string, url:string){
        return new Music(music, singer, url);
    }




    private setPlaceUrl(music: string){
        if(music === null) throw new Error (`${__dirname} :music 값이 존재하지 않습니다.`);
        this.music=music;
    }

    private setPhone(singer:string){
        if(singer === null) throw new Error (`${__dirname} : singer 값이 존재하지 않습니다.`);
        this.singer=singer;
    }

    private setRoadAddressName(url:string){
        if(url === null) throw new Error (`${__dirname} : url값이 존재하지 않습니다.`);
        this.url=url;
    }
}