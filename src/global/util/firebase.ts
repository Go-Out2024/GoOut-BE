import { Response } from 'express';
import { firebase } from '../infrastructure/firebase.js';

const pushNotice = async (req:Request, res:Response) => {
  const message = {
    token: '안드로이드 token값',
    notification: {
      body: "Notice",
    },
    data: {
      title: "알림 테스트",
      body: "알림 테스트 중 일부입니다.",
    },
  };

  try {
    const response = await firebase.messaging().send(message);
    console.log('Successfully sent message:', response);
    res.send(response);
  } catch (error) {
    console.log('Error sending message:', error);
    res.status(500).send(error);
  }
};

export default pushNotice;
