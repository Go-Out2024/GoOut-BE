

export class SuccessResponseDto<T> {
  
    private data: T;

    public static of<T>(data: T): SuccessResponseDto<T> {
        return new SuccessResponseDto<T>(data);
    }

    constructor(data: T) {
     
        this.data = data;
    }
}
