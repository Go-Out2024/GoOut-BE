import OpenAI from "openai";
import { envs } from "../config/environment.js";

const openai = new OpenAI({
    apiKey: envs.apikey.openai,
  });

export const musicRecommend = async () => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "힘이 들 때 위로가 되는 노래를 하나만 추천해줘. 노래 제목과 부른 가수만 알려줘." }],
    model: "gpt-3.5-turbo",
  });
  console.log(completion.choices[0]);
  return completion.choices[0].message.content;
}
