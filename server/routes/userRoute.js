import expressRouter from "express";
import { authToken } from "../middleware/authToken.js";
import {
  getUserById,
  getAllUsers,
  updateUserById,
  deleteUserById,
} from "../controllers/userController.js";

const router = expressRouter();

router.get("/:id", authToken, getUserById);
router.get("/", authToken, getAllUsers);
router.put("/:id", authToken, updateUserById);
router.delete("/:id", authToken, deleteUserById);

export default router;