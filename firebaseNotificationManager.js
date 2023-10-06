import dotenv from "dotenv";
import FCM from "fcm-node";
import Credentials from "./models/Credentials.js";
dotenv.config();
import mongoose from "mongoose";
// const serverKey = process.env.FIRE_BASE_CLOUD_MESSAGING_KEY;
const serverKey =
  "AAAAJ6KspkU:APA91bHgS4shumSgmpIIrVzG3ZJR-vGeftU2p45mh6ag6E9TXVfVgR1RGqnPo3BAcfNPddaKh6oZsR4q6_JPO51SLSAcP5jkL19yVBoK2vbfPKkt_C5zrToc_q-TsNEhMVhQG8sTiY6L";
const fcm = new FCM(serverKey);

const sendNotification = async (email, message) => {
  try {
    console.log(email);
    let pushToken = await Credentials.findOne({ email: email }).select(
      "fcmToken"
    );
    console.log(pushToken.fcmToken, "pt");
    var Pushmessage = {
      registration_ids: pushToken.fcmToken,
      content_available: true,
      mutable_content: true,
      notification: {
        title: message.title,
        body: message.body,
        sound: "mySound",
      },
    };

    fcm.send(Pushmessage, (err, res) => {
      if (err) {
        console.log("pushMessage error", err);
      } else {
        console.log("push notification sent", res);
      }
    });
  } catch (error) {
    console.log("pushMessage error catch", error);
  }
};

export default sendNotification;
