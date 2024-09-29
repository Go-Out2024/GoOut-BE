import axios from 'axios';
import { Service } from 'typedi';
import { envs } from '../config/environment';


@Service()
export class KakaoApiService { 
    private readonly KAKAO_API_URL = 'https://kapi.kakao.com/v2/user/me';
    private readonly KAKAO_EATERY_URL = "https://dapi.kakao.com/v2/local/search/category.json"

    async bringUserInfo(accessToken: string) {
        try {
            const response = await axios.get(this.KAKAO_API_URL, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return {
                kakaoId: response.data.id,
                email: response.data.kakao_account.email,
            };
        } catch (error) {
            throw new Error('카카오에서 사용자 정보 가져오기 실패');
        }
    }


    async bringEateryData(x:string, y:string, category:string, radius:string, page:string, size: string){
        try {
            const response = await axios.get(`${this.KAKAO_EATERY_URL}?x=${x}&y=${y}&category\_group\_code=${category}&radius=${radius}&page=${page}&size=${size}`,{
                headers: {'Authorization': `KakaoAK ${envs.kakao.key}`}});
            return response.data.documents;
        }catch(error){
            throw new Error("데이터 조회 에러");    
        }                
    }
}