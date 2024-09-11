import expressRouter from "express";
import {
  createEvent,
  getEventById,
  getEventsByOrganizerId,
  getAllEvents,
  updateEventById,
  deleteEventById,
} from "../controllers/eventController.js";

const router = expressRouter();

router.post("/:id", createEvent);
router.get("/:id", getEventById);
router.get("/organizer/:id", getEventsByOrganizerId);
router.get("/", getAllEvents);
router.put("/:id", updateEventById);
router.delete("/:id", deleteEventById);

export default router;
