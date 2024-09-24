
import { firebase } from '../config/firebase';


/**
 * 
 * @param engineValue 기기 토큰 값
 * @param title 알림 제목
 * @param body 알림 내용
 */
export const pushNotice = async (engineValue:string, title:string, body:string) => {
  const message = {
    token: engineValue,
    notification: {
      title: title,
      body: body,
    },
  };

  const response = await firebase.messaging().send(message);
  console.log('Successfully sent message:', response);
};

