import cors from 'cors'
import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import eventRoute from "./routes/eventRoute.js";
import organizerRoute from "./routes/organizerRoute.js";
import ticketRoute from "./routes/ticketRoute.js";
import { connectDB } from "./config/mongo.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

const app = express();
dotenv.config();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await connectDB();

app.get("/", (req, res) => {
  res.send("App is running!!");
});

app.use("/api/", apiLimiter);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/event", eventRoute);
app.use("/api/organizer", organizerRoute);
app.use("/api/ticket", ticketRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});

export default app;
