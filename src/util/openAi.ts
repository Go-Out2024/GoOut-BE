import OpenAI from "openai";
import { envs } from "../config/environment.js";

const openai = new OpenAI({
    apiKey: envs.apikey.openai,
  });

export const musicRecommend = async () => {

  const RROMPT = 
  `
    힘이 들 때 위로가 되는 제목, 가수가 매치가 되는 최신 노래를 하나만 추천해줘. 노래 제목에서 한글, 영어가 괄호처리 돼있으면 한글 보여줘.
    또한, 해당 노래에 여러 가수가 있을 경우 메인 가수로 알려줘.
    결괏값은 딱 조회된 노래 제목, 가수, https://www.youtube.com/results?search_query=노래제목+부른가수
    꼭 노래 제목, 가수, url 세 개를 각각 콤마로 분리해서 줘. 앞에 노래제목 이런 키를 주지 말고 바로 주어진 것만 줘.
    무조건 콤마 세 개로만 조회가 되야해.
  `;
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", 
    content: RROMPT
   }],
    model: "gpt-3.5-turbo",
  });
  console.log(completion.choices[0].message.content);
  return completion.choices[0].message.content;
}
