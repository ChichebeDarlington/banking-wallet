import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js";
import transactRoute from "./routes/transactRoute.js";
import requestRoute from "./routes/requestRoute.js";

import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/user", userRoute);
app.use("/api/transact", transactRoute);
app.use("/api/request", requestRoute);

// mongoose.connect("mongodb://0.0.0.0:27017/wallet");
mongoose.connect(process.env.MONGO_URI);
const connectDB = mongoose.connection;
connectDB.on("error", () => {
  console.log("Error while connecting to database");
});
connectDB.on("connected", () => {
  console.log("DB connected successfully");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("App running");
});
