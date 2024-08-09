import OpenAI from "openai";
import { envs } from "../config/environment.js";

const openai = new OpenAI({
    apiKey: envs.apikey.openai,
  });

export const musicRecommend = async () => {

  const RROMPT = 
  `
    힘이 들 때 위로가 되는 노래를 하나 추천해줘.
    노래를 추천할 때, 무조건 해당 가수가 부른 노래여야해. 그게 아니라면 해당 노래는 주지마.
    해당 노래의 제목과 가수 이 두 개만 콤마로 추출해줘.
    예를 들면, 이하이가 부른 한숨이라는 노래를 추천해준다고 가정하자. 
    그럼 너는 무조건 (이하이, 한숨) 이렇게 소괄호 안에 있는 형식으로 출력해줘. 
    추가로 소괄호는 제거해서 출력해줘.
    이외 텍스트는 절대 주지마
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
