// Initializing area (dependencies)

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");

// Including development specific files

// Middleware setup
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json()); //for parsing the body
app.use(helmet()); //for securing headers
app.use(morgan("common")); //for logging the request on console

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

// setting up the server

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
