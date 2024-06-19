import { Body, HttpCode, JsonController, Post } from "routing-controllers";
import { Service } from "typedi";
import { PushNoticeRequest } from "../dto/request/PushNoticeRequest.js";
import {pushNotice} from "../util/firebaseMessage.js";
import { SuccessResponseDto } from "../response/SuccessResponseDto.js";


@Service()
@JsonController('/notice')
export class FirebaseController{


    @HttpCode(200)
    @Post('/send')
    async executePushNotice(@Body() pushNoticeRequest: PushNoticeRequest) {
        pushNotice(pushNoticeRequest.getEngineValue(),"알림 테스트", "test")
        return SuccessResponseDto.of(null);
    }
}