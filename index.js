// Initializing area (dependencies)

import cors from "cors";
import express from "express";
import mongoose from "mongoose";
// import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Including development specific files
import logInRoutes from "./routes/logInRoutes.js";
import signUpRoutes from "./routes/signUpRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import verifyToken from "./middleware/verifyauthToken.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Middleware setup
const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

dotenv.config();
app.use(express.json()); //for parsing the body
// app.use(helmet()); //for securing headers
app.use(morgan("dev")); //for logging the request on console
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(
  "/documents",
  express.static(path.join(__dirname + "/public/documents"))
);

app.use("/public", express.static(path.join(__dirname + "/public")));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname + "/public/documents"));
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(".");
    const ext = name.pop();
    cb(null, `${req.body.email}.${ext}`);
    req.body.documentName = `${req.body.email}.${ext}`;
  },
});

const uploadDocument = multer({ storage: storage });

// DataBase Connections
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DataBase Connected ;)");
  })
  .catch((err) => {
    console.log("Data Base Connection error ", err);
  });

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Servers says hello" });
});
app.use("/login", logInRoutes);
app.use("/signup", signUpRoutes);
app.use("/provider", uploadDocument.single("document"), providerRoutes);
app.use("/user", userRoutes);
app.use("/job", jobRoutes);
app.use("/notification", notificationRoutes);
// setting up the server

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
