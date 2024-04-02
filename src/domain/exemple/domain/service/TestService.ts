import { BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';


@Service()
export class TestService {
    constructor() {}

 
    public async test() {
        throw new BadRequestError('ALREADY_EXIST_ID');
    }
}