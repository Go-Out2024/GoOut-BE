import axios from 'axios';
import { response } from 'express';
import { Service } from 'typedi';


@Service()
export class KakaoApiService { 
    private readonly KAKAO_API_URL = 'https://kapi.kakao.com/v2/user/me';

    async getUserInfo(accessToken: string) {
        try {
            const response = await axios.get(this.KAKAO_API_URL, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(response.data.id)
            return {
                kakaoId: response.data.id,
                email: response.data.kakao_account.email,
             //   phoneNumber: response.data.kakao_account.phone_number
            };
        } catch (error) {
            console.error('카카오에서 사용자 정보를 가져오지 실패:', error);
            throw new Error('카카오에서 사용자 정보 가져오기 실패');
        }
    }
    


}