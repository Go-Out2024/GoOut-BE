import { BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { SuccessResponseDto } from '../../../../global/response/SuccessResponseDto';
import { ErrorResponseDto } from '../../../../global/response/ErrorResponseDto';
import { ErrorCode } from '../../../../global/exception/ErrorCode';


@Service()
export class TestService {
    constructor() {}

 
    public async test() {

        const value = true;
     //   return  ErrorResponseDto.of(ErrorCode.ERROR);
        this.verify(value)
        return SuccessResponseDto.of({"to":"Lee"});

    }


    private verify(value: boolean){
        if(value === true){
            throw  ErrorResponseDto.of(ErrorCode.ERROR);
        }
      
    }

   
}