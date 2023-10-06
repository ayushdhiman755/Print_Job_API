import { Router } from "express";
import verifyToken from "../middleware/verifyauthToken.js";
import Credentials from "../models/Credentials.js  ";

const routes = Router();

routes.post("/updateToken", verifyToken, async (req, res) => {
  try {
    const allUsers = await Credentials.find({
      fcmToken: { $in: [req.body.fcmToken] },
    });

    allUsers.map((user) => {
      user.fcmToken.filter((tkn) => tkn !== req.body.fcmToken);
      user.save();
    });
    Credentials.findOneAndUpdate(
      { email: req.body.email },
      { $push: { fcmToken: req.body.fcmToken } }
    );
    res.status(200).json("token updates successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json("internal Server Error");
  }
});

export default routes;
