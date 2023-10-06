import Credentials from "../models/Credentials.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Router } from "express";

const routes = Router();
routes.post("/", async (req, res) => {
  const salt = await bcrypt.genSalt(process.env.SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPassword;
  const isPresent = await Credentials.findOne({ email: req.body.email });
  // console.log(isPresent);
  if (isPresent) {
    res.status(406).json("Email Already Registered");
  } else {
    try {
      const newUser = new Credentials(req.body);
      const savedUser = await newUser.save();
      const user = {
        email: savedUser._doc.email,
        type: savedUser._doc.type,
        name: savedUser._doc.userName,
        otherDetails: savedUser._doc.otherDetails,
      };
      const token = await jwt.sign(
        {
          email: savedUser._doc.email,
          password: savedUser._doc.password,
        },
        process.env.JWT_SECRETE
      );
      res.status(200).json({ authToken: token, user: user });
    } catch (error) {
      console.log(error);
      res.status(501).json("Some Internal Server Error Occured");
    }
  }
  // res.status(200).json({ res: req.body });
});
export default routes;
