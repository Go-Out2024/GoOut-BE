
import {musicRecommend} from '../../../src/util/openAi';
import OpenAI from 'openai';

const aiResponse = {
    choices:[
        {
            message:{
                content: "ai response"
            }
        }
    ]
}


jest.mock('openai', () => {
    return jest.fn().mockImplementation(()=>{
        return {
            chat:{
                completions:{
                    create: jest.fn().mockImplementation(async()=>{
                        return aiResponse;
                    })
                }
            }
        }
    })
});

describe('openAi Util Test', () => {
    describe('musicRecommend function test', () => {
        it('basic', async () => {
            const result = await musicRecommend();
            expect(result).toBe("ai response")
            
        });
    });
});
