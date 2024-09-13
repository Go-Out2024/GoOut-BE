

/**
* 
* @param data 
* @returns  데이터가 없을 경우 false 반환, 있을 경우 true 반환
*/
export const checkData = (data: any): boolean => {
    let result = true
    if (data === undefined) {   // 데이터가 없을 경우
        return result = false;
    }
    return result;
}

/**
 * 두 날짜를 비교해주는 함수
 * @param relativeDate 비교하는 날짜
 * @param targetDate 비교 당하는 날짜
 * @returns 같을 경우 true, 아닐 경우 false
 */
export const isSameDay = (relativeDate: Date, targetDate: Date): boolean =>{
    return relativeDate.getTime() === targetDate.getTime();
}




