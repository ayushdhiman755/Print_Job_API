import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Credentials from "../models/Credentials.js";
const verifyToken = async (req, res, next) => {
  const token = req.body.authToken;
  if (!token) {
    res
      .status(400)
      .json({ error: " Invalid credential use a valid web token" });
  } else {
    try {
      const data = await jwt.verify(token, process.env.JWT_SECRETE);
      const user = await Credentials.findOne({ email: data.email });
      let verified = bcrypt.compare(user.password, data.password);
      if (req.body.email) {
        if (data.email !== req.body.email) verified = false;
      }
      if (verified) {
        req.body.tokenVerified = true;
        next();
      } else {
        res.status(401).json({ error: "Invalid auth token" });
      }
    } catch (err) {
      console.log(err);
      res.status(401).json({ error: "Invalid auth token" });
    }
  }
};

export default verifyToken;
