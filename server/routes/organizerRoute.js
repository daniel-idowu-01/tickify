import expressRouter from "express";
import {
  createOrganizer,
  getOrganizerById,
  getAllOrganizers,
  updateOrganizerById,
  deleteOrganizerById,
} from "../controllers/organizerController.js";

const router = expressRouter();

router.post("/", createOrganizer);
router.get("/:id", getOrganizerById);
router.get("/", getAllOrganizers);
router.put("/:id", updateOrganizerById);
router.delete("/:id", deleteOrganizerById);

export default router;
