
import { firebase } from '../config/firebase.js';



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

