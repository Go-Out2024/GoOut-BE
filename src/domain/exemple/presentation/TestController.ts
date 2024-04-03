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
import { Service, Container } from 'typedi';
import { TestService } from '../domain/service/TestService.js';


@JsonController('/test')
@Service()
export class TestController {
    constructor(private testService: TestService) {
        this.testService = Container.get(TestService);
    }

    @HttpCode(200)
    @Get()
    public async test(
       
    ){

        return await this.testService.test();
    }

 
}
