import expressRouter from "express";
import {
  createOrganizer,
  getOrganizerById,
  updateOrganizerById,
  deleteOrganizerById,
} from "../controllers/organizerController.js";

const router = expressRouter();

router.post("/", createOrganizer);
router.get("/", getOrganizerById);
router.put("/:id", updateOrganizerById);
router.delete("/:id", deleteOrganizerById);

export default router;
