import expressRouter from "express";
import { authToken } from "../middleware/authToken.js";
import {
  createComment,
  getCommentById,
  getCommentsByParentId,
  getAllCommentsByEventId,
  deleteCommentById,
} from "../controllers/commentController.js";

const router = expressRouter();

router.post("/:userId/:eventId/:parentCommentId", authToken, createComment);
router.get("/:id", authToken, getCommentById);
router.get("/:id/comments", authToken, getCommentsByParentId);
router.get("/:id/events/comments", authToken, getAllCommentsByEventId);
router.delete("/:id", authToken, deleteCommentById);

export default router;
