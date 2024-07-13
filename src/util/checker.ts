

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




