import { Body, HttpCode, JsonController, Post } from "routing-controllers";
import { Service } from "typedi";
import { PushNoticeRequest } from "../dto/request/PushNoticeRequest";
import {pushNotice} from "../util/firebaseMessage";
import { SuccessResponseDto } from "../response/SuccessResponseDto";


@Service()
@JsonController('/notice')
export class FirebaseController{

    /**
     * 기기 토큰 값을 보내 푸쉬 알림 요청 함수
     * @param pushNoticeRequest 기기 토큰 값 요청
     * @returns 
     */
    @HttpCode(200)
    @Post('/send')
    async executePushNotice(@Body() pushNoticeRequest: PushNoticeRequest) {
        pushNotice(pushNoticeRequest.getEngineValue(),"알림 테스트", "test")
        return SuccessResponseDto.of(null);
    }
}