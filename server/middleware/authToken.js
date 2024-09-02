import jwt from "jsonwebtoken";
import { errorHandler } from "./errorHandler.js";

export const authToken = (req, res, next) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  if (!token) {
    return next(errorHandler(401, "Unauthorized"))
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(err);
    }
    req.user = user;
    next();
  });
};
