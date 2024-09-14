import expressRouter from "express";
import { authToken } from "../middleware/authToken.js";
import {
  createOrganizer,
  getOrganizerById,
  getAllOrganizers,
  updateOrganizerById,
  deleteOrganizerById,
} from "../controllers/organizerController.js";

const router = expressRouter();

router.post("/", authToken, createOrganizer);
router.get("/:id", authToken, getOrganizerById);
router.get("/", authToken, getAllOrganizers);
router.put("/:id", authToken, updateOrganizerById);
router.delete("/:id", authToken, deleteOrganizerById);

export default router;
