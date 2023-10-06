import { Router } from "express";
import Credentials from "../models/Credentials.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Provider from "../models/Provider.js";
import User from "../models/User.js";

const routes = Router();
routes.post("/", async (req, res) => {
  const currentUser = await Credentials.findOne({ email: req.body.email });
  if (!currentUser) {
    res.status(401).json("invalid Credentials");
  } else {
    const isVerified = bcrypt.compare(req.body.password, currentUser.password);
    if (isVerified) {
      const token = await jwt.sign(
        {
          email: currentUser.email,
          password: currentUser.password,
        },
        process.env.JWT_SECRETE
      );
      const { password, ...otherDetails } = currentUser._doc;
      let allDetails = undefined;
      if (otherDetails.otherDetails) {
        if (otherDetails.type == "Provider") {
          allDetails = await Provider.findById(
            otherDetails.otherDetails
          ).select([
            "-documentName",
            "-_id",
            "-createdAt",
            "-updatedAt",
            "-__v",
          ]);
        } else {
          allDetails = await User.findById(otherDetails.otherDetails);
        }
      }
      res.status(200).json({
        authToken: token,
        user: otherDetails,
        otherDetails: allDetails,
      });
    } else {
      res.status(401).json("invalid Credentials");
    }
  }
});
routes.post("/getAll", async (req, res) => {
  const data = await jwt.verify(req.body.authToken, process.env.JWT_SECRETE);
  const user = await Credentials.findOne({ email: data.email });
  // if()
  var otherDetails = undefined;
  if (user.otherDetails) {
    if (user.type === "Provider") {
      otherDetails = await Provider.findById(user.otherDetails);
      res.status(200).json({ user: user, otherDetails: otherDetails });
    } else {
      otherDetails = await User.findById(user.otherDetails);
      res.status(200).json({ user: user, otherDetails: otherDetails });
    }
  } else {
    res.status(200).json({ user: user, otherDetails: otherDetails });
  }
  // res.status(200).json({});
});
export default routes;
