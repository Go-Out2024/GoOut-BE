

export enum Period{
    "매주"=7,
    "반복 안 함"=0,
    "매일"=1,
    "2주마다"=14
}

export const getPeriodValue = (key: string): number => {
    return Period[key as keyof typeof Period];
}

export const getPeriodKey = (value: number): string | null => {
    const keys = Object.keys(Period) as Array<keyof typeof Period>;
    for (const key of keys) {
        if (Period[key] === value) {
            return key;
        }
    }
    return null;
}