import { Body, HttpCode, JsonController, Post, Req, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import { SuccessResponseDto } from "../response/SuccessResponseDto.js";
import { compareAuthToken } from "../middleware/jwtMiddleware.js";
import {  CalendarContents } from "../dto/request/CalendarContent.js";
import { CalendarService } from "../service/Calendar.Service.js";
import { Request } from 'express'

@Service()
@JsonController('/calendar')
export class CalendarController{

    constructor(
        private readonly calendarService: CalendarService
    ){}


    /**
     * 캘린저 준비물 or 일정 삽입 함수
     * @param calendarContents 캘린더 내용 정보
     * @returns 
     */
    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Post('/content')
    async penetrateScheduleOrProduct(@Body() calendarContents: CalendarContents, @Req() req: Request) {
        await this.calendarService.penetrateScheduleOrProduct(calendarContents, req.decoded.id);
        console.log("캘린더 일정 or 준비물 삽입 완료");
        return SuccessResponseDto.of();
    }
}