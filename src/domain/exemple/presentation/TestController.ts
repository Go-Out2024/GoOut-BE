import {
    JsonController,
    Get,
    Put,
    Post,
    Delete,
    HttpCode,
    Param,
    Body,
    Res,
    UseBefore,
    NotFoundError,
    ForbiddenError,
    BadRequestError,
    InternalServerError,
    Req,
} from 'routing-controllers';
import { Service } from 'typedi';
import { TestService } from '../domain/service/TestService.js';


@JsonController('/test')
@Service()
export class TestController {
    constructor(private testService: TestService) {}

    @HttpCode(200)
    @Get('')
    public async getUsers(){

        console.log("sd")

        return await this.testService.test();
  
    }

 
}
