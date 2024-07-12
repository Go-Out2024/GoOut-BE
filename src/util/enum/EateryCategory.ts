


export enum EateryCategory{
    음식점="FD6",
    카페="CE7"
}


export const getProductCategoryByCondition = (key: string): string => {
    return EateryCategory[key as keyof typeof EateryCategory];
}