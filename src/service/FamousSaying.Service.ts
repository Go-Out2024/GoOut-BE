import { Service } from "typedi";
import { getFamousSaying,  getFamousSayingRandomNumber, getWriter } from "../util/enum/FamousSaying.js";
import { FamousSaying } from "../dto/response/FamousSaying.js";



@Service()
export class FamousSayingService{

    async bringFamousSaying(){
        const ramdom = getFamousSayingRandomNumber()
        return FamousSaying.of(getFamousSaying(ramdom), getWriter(ramdom));  
    }

}