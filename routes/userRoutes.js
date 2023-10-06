import { Router, json } from "express";
import path, { join } from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import User from "../models/User.js";
import Credentials from "../models/Credentials.js";
import fs from "fs";
import pdf from "pdf-page-counter";
import Provider from "../models/Provider.js";
import Job from "../models/Job.js";
import verifyToken from "../middleware/verifyauthToken.js";
import sendNotification from "../firebaseNotificationManager.js";

const routes = Router();

async function findCandidates(coordinates) {
  let cand = [];
  let dis = 1000;
  while (dis <= 6000 && cand.length < 5) {
    cand = [];
    const filter = {
      location: {
        $nearSphere: {
          $maxDistance: dis,
          $geometry: {
            $type: "Point",
            coordinates: coordinates,
          },
        },
      },
    };
    let res = await Provider.find(filter);
    res.map((pro) => {
      cand.push(pro.email);
    });
    dis = dis + 1000;
  }
  return { potentialProviders: cand, maxDistance: dis };
}

async function estimateCost(body) {
  const words = body.documentName.split(".");
  const ext = words.pop();
  var pages = 1;
  try {
    if (ext.toLowerCase() === "pdf") {
      let dataBuffer = fs.readFileSync(
        path.join(
          __dirname + "../../" + "public/JobDocuments/" + body.documentName
        )
      );
      const data = await pdf(dataBuffer);
      pages = data.numpages;
      let cost = pages * 5 * body.numberOfCopies;
      let pcost = cost * 1.1 + 25;
      return { userCost: pcost, providerPrice: cost, pages: pages };
    }
  } catch (error) {
    console.log(error);
    let cost = pages * 5 * body.numberOfCopies;
    let pcost = cost * 1.1 + 25;
    return { userCost: pcost, providerPrice: cost, pages: pages };
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname + "../../" + "public/ProfilePictures"));
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(".");
    const ext = name.pop();
    cb(null, `${req.body.email}.${ext}`);
    req.body.documentName = `${req.body.email}.${ext}`;
  },
});

const uploadDocument = multer({ storage: storage });

routes.post(
  "/uploadDetails",
  uploadDocument.single("ProfileImage"),
  async (req, res) => {
    try {
      const newDetails = {
        email: req.body.email,
        phone: req.body.Phone,
        phone: req.body.Phone,
        city: req.body.City,
        state: req.body.State,
        PostalCode: req.body.PostalCode,
        location: JSON.parse(req.body.Location),
      };
      if (req.body.documentName)
        newDetails.profilePicture = req.body.documentName;
      let savedDetails = new User(newDetails);

      savedDetails = await savedDetails.save();
      let user = await Credentials.findOneAndUpdate(
        {
          email: req.body.email,
        },
        { otherDetails: savedDetails._id }
      );
      const userCred = await Credentials.findOne({
        email: req.body.email,
      }).select("-password");
      res.status(200).json({ user: userCred, userDetails: savedDetails });
    } catch (err) {
      console.log(err);
      res.status(500).json("Internal Server Error");
    }
  }
);

const jobStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname + "../../" + "public/JobDocuments"));
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(".");
    const ext = name.pop();
    let jobDocumentName = `${req.body.createdBy}${Date.now()}.${ext}`;
    cb(null, jobDocumentName);
    req.body.documentName = jobDocumentName;
  },
});

const uploadJobDocument = multer({ storage: jobStorage });

routes.post(
  "/createOrder",
  uploadJobDocument.single("Document"),
  async (req, res) => {
    try {
      const { potentialProviders, maxDistance } = await findCandidates(
        JSON.parse(req.body.deliveryLocation)
      );
      const estimates = await estimateCost(req.body);
      let { providerPrice, userCost, pages } = estimates;
      req.body.potentialCandidates = potentialProviders;
      req.body.userPrice = userCost;
      req.body.providerPrice = providerPrice;
      req.body.documentSize = pages;
      req.body.deliveryDate = new Date(JSON.parse(req.body.deliveryDate));
      let newJob = new Job(req.body);
      let savedJob = await newJob.save();
      res.status(200).json(savedJob);
    } catch (err) {
      console.log(err);
      res.status(500).json("internal Server Error");
    }
  }
);

routes.post("/cancelOrder", verifyToken, async (req, res) => {
  try {
    Job.findByIdAndDelete(req.body.jobId);
    res.status(200).json("deleted successful");
  } catch (error) {
    res.status(500).json("internal Server error");
  }
});

routes.post("/confirmOrder", verifyToken, async (req, res) => {
  try {
    const job = await Job.findById(req.body.jobId);
    let user = await User.findOne({ email: job.createdBy });
    user.jobs.unshift(job._id);
    user.save();
    job.potentialCandidates.map(async (provider) => {
      const res = await Provider.findOneAndUpdate(
        { email: provider },
        {
          $push: { jobsProposed: job._id.toString() },
        }
      );
      // console.log(res,"updated")
      sendNotification(provider, {
        title: "New Job for you",
        body: `₹ ${job.providerPrice} for ${job.documentSize} pages`,
      });
    });
    res.status(200).json("Order Confirmed");
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
});

export default routes;
