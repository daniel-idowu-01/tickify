import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";
import { connectDB } from "./config/mongo.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await connectDB();

app.get("/", (req, res) => {
  res.send("App is running!!");
});

app.use("/api/auth", authRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res
    .status(statusCode)
    .json({ success: false, statusCode, message });
});

export default app;
