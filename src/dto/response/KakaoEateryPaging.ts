import { KakaoEatery } from "../KakaoEatery";


export class KakaoEateryPaging{
    private currentPage:number;
    private totalPage:number;
    private kakaoEatery:KakaoEatery[];

    constructor(currentPage:number, totalPage:number, kakaoEatery:KakaoEatery[]){
        this.setCurrentPage(currentPage);
        this.setTotalPage(totalPage);
        this.setKakaoEatery(kakaoEatery);
    }

    public static of (currentPage:number, totalPage:number, kakaoEatery:KakaoEatery[]){
        return new KakaoEateryPaging(currentPage,totalPage,kakaoEatery)
    }

    private setCurrentPage(currentPage:number){
        this.currentPage=currentPage;
    }

    private setTotalPage(totalPage:number){
        this.totalPage=totalPage
    }

    private setKakaoEatery(kakaoEatery:KakaoEatery[]){
        this.kakaoEatery=kakaoEatery;
    }
}