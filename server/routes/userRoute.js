import expressRouter from "express";
import { authToken } from "../middleware/authToken.js";
import {
  getUserById,
  getAllUsers,
  updateUserById,
  changeUserPassword,
  deleteUserById,
} from "../controllers/userController.js";

const router = expressRouter();

router.get("/:id", authToken, getUserById);
router.get("/", authToken, getAllUsers);
router.put("/:id", authToken, updateUserById);
router.put("/password/change-password", authToken, changeUserPassword);
router.delete("/:id", authToken, deleteUserById);

export default router;
/* $2b$09$beNZoxamQfoH6suCfEo0aeFxwWGCD4tnyySLjRtqh7UonX70GMI/u */