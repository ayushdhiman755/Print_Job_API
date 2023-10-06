import { Router, json } from "express";
// import Credentials from "../models/Credentials.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/verifyauthToken.js";
import Provider from "../models/Provider.js";
import Credentials from "../models/Credentials.js";
const routes = Router();
routes.post("/uploadDetails", verifyToken, async (req, res) => {
  // console.log(req.body);

  // [30.2182978, 78.7667117];
  try {
    const newDetails = new Provider({
      firmName: req.body.firmName,
      verificationDocumentType: req.body.verificationDocumentType,
      paperSize: JSON.parse(req.body.paperSize),
      email: req.body.email,
      location: { type: "Point", coordinates: JSON.parse(req.body.location) },
      City: req.body.City,
      State: req.body.State,
      Phone: req.body.Phone,
      PostalCode: req.body.PostalCode,
      printTypes: JSON.parse(req.body.printTypes),
      documentName: req.body.documentName,
    });
    const otherDetails = await newDetails.save();
    const updatedUser = await Credentials.findOneAndUpdate(
      { email: req.body.email },
      { otherDetails: otherDetails._id }
    );
    let otherToSend = await Credentials.findOne({
      email: req.body.email,
    }).select("-password");
    res.status(200).json({ user: otherToSend, userDetails: otherDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json("Some internal error occured");
  }
});
export default routes;
