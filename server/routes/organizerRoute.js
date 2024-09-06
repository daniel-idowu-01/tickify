import expressRouter from "express";
import {
  createOrganizer,
  updateOrganizerById,
  deleteOrganizerById,
} from "../controllers/organizerController.js";

const router = expressRouter();

router.post("/", createOrganizer);
router.put("/:id", updateOrganizerById);
router.delete("/:id", deleteOrganizerById);

export default router;
