import expressRouter from "express";
import {
  createComment,
  getCommentById,
  getCommentsByParentId,
  getAllCommentsByEventId,
  deleteCommentById,
} from "../controllers/commentController.js";

const router = expressRouter();

router.post("/:userId/:eventId/:parentCommentId", createComment);
router.get("/:id", getCommentById);
router.get("/:id/comments", getCommentsByParentId);
router.get("/:id/events/comments", getAllCommentsByEventId);
router.delete("/:id", deleteCommentById);

export default router;
