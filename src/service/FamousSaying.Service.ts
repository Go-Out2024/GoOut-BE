import { Service } from "typedi";
import { getFamousSaying,  getFamousSayingRandomNumber, getWriter } from "../util/enum/FamousSaying";
import { FamousSaying } from "../dto/response/FamousSaying";



@Service()
export class FamousSayingService{

    async bringFamousSaying(){
        const ramdom = getFamousSayingRandomNumber()
        return FamousSaying.of(getFamousSaying(ramdom), getWriter(ramdom));  
    }

}