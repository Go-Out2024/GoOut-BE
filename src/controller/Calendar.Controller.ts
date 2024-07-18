import { Body, Delete, Get, HttpCode, JsonController, Patch, Post, QueryParam, QueryParams, Req, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import { SuccessResponseDto } from "../response/SuccessResponseDto.js";
import { compareAuthToken } from "../middleware/jwtMiddleware.js";
import {  CalendarInsert } from "../dto/request/CalendarInsert.js";
import { CalendarService } from "../service/Calendar.Service.js";
import { Request } from 'express'
import { CalendarErase } from "../dto/request/CalendarErase.js";
import { CalendarUpdate } from "../dto/request/CalendarUpdate.js";
import { CalendarDataCheck } from "../dto/response/CalendarDataCheck.js";

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
    async penetrateScheduleOrProduct(@Body() calendarContents: CalendarInsert, @Req() req: Request) {
        await this.calendarService.penetrateScheduleOrProduct(calendarContents, req.decoded.id);
        console.log("캘린더 일정 or 준비물 삽입 완료");
        return SuccessResponseDto.of();
    }


    /**
     * 캘린더 삭제 함수
     * @param calendarErase 캘린더 삭제 dto
     * @param req 
     * @returns 
     */
    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Delete('/content')
    async eraseScheduleOrProduct(@Body() calendarErase: CalendarErase, @Req() req: Request) {
        await this.calendarService.eraseScheduleOrProduct(req.decoded.id, calendarErase.getCalendarId());
        console.log("캘린더 일정 or 준비물 삭제 완료");
        return SuccessResponseDto.of();
    }


    /**
     * 캘린더 내용 수정 함수
     * @param calendarUpdate 캘린더 수정 dto
     * @param req 
     * @returns 
     */
    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Patch('/content')
    async modifyScheduleOrProduct(@Body() calendarUpdate: CalendarUpdate, @Req() req: Request) {
        await this.calendarService.modifyScheduleOrProduct(calendarUpdate, req.decoded.id);
        console.log("캘린더 일정 or 준비물 수정 완료");
        return SuccessResponseDto.of();
    }


    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Get()
    async bringScheduleOrProductChecking(@QueryParam('month') month:string, @Req() req: Request):Promise<SuccessResponseDto<CalendarDataCheck>> {
        const result = await this.calendarService.bringScheduleOrProductChecking(req.decoded.id, month);
        console.log("달 별 캘린더 일정 or 준비물 존재 여부 조회 완료");
        return SuccessResponseDto.of(result);
    }
}