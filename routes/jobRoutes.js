import { Router } from "express";
import Job from "../models/Job.js";
import verifyToken from "../middleware/verifyauthToken.js";
import Provider from "../models/Provider.js";
const router = Router();

router.post("/getJobDetails", verifyToken, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.body.jobId });
    res.status(200).json(job);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

router.post("/accept", verifyToken, async (req, res) => {
  try {
    const acceptor = await Provider.findOne({ email: req.body.email });
    acceptor.jobsProposed = acceptor.jobsProposed.filter(
      (id) => id !== req.body.jobId
    );
    Job.findByIdAndUpdate(req.body.jobId, { status: "Assigned" });
    acceptor.jobsAssigned.unshift(req.body.jobId);
    const saveddetails = await acceptor.save();
    res.status(200).json({ userDetails: saveddetails });
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
});

router.post("/decline", verifyToken, async (req, res) => {
  try {
    const pro = await Provider.findOne({ email: req.body.email });
    pro.jobsProposed=pro.jobsProposed.filter((id) => id !== req.body.jobId);
    const updatedUser = await pro.save();
    // { $pull: { jobsProposed: req.body.jobId } }
    res.status(200).json({ userDetails: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
});

export default router;
