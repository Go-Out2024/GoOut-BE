import { Body, Delete, Get, HttpCode, JsonController, Param, Patch, Post, QueryParam, QueryParams, Req, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import { SuccessResponseDto } from "../response/SuccessResponseDto";
import { compareAuthToken } from "../middleware/jwtMiddleware";
import {  CalendarInsert } from "../dto/request/CalendarInsert";
import { CalendarService } from "../service/Calendar.Service";
import { Request } from 'express'
import { CalendarErase } from "../dto/request/CalendarErase";
import { CalendarUpdate } from "../dto/request/CalendarUpdate";
import { CalendarDataCheck } from "../dto/response/CalendarDataCheck";
import { CalendarDatas } from "../dto/response/CalendarData";

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
        await this.calendarService.eraseScheduleOrProduct(req.decoded.id, calendarErase.getCalendarIds());
        console.log("캘린더 일정 or 준비물 삭제 완료");
        return SuccessResponseDto.of();
    }


    /**
     * 날짜별 준비물 or 일정 조회 함수
     * @param date 조회할 날짜
     * @param req 
     * @returns 
     */
    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Get('/:date')
    async bringScheduleOrProduct(@Param('date') date:string, @Req() req: Request):Promise<SuccessResponseDto<CalendarDatas>> {
        const result = await this.calendarService.bringScheduleOrProduct(req.decoded.id, date);
        console.log("일 별 캘린더 일정 or 준비물 조회 완료");
        return SuccessResponseDto.of(result);
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


    /**
     * 해당 달에 있는 일정 or 준비물 날짜 조회 함수
     * @param month 조회할 달
     * @param req 
     * @returns 
     */
    @HttpCode(200)
    @UseBefore(compareAuthToken)
    @Get()
    async bringScheduleOrProductChecking(@QueryParam('month') month:string, @Req() req: Request):Promise<SuccessResponseDto<CalendarDataCheck>> {
        console.log(req.decoded.id)
        const result = await this.calendarService.bringScheduleOrProductChecking(req.decoded.id, month);
        console.log("달 별 캘린더 일정 or 준비물 존재 여부 조회 완료");
        return SuccessResponseDto.of(result);
    }
}