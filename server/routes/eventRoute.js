import expressRouter from "express";
import { authToken } from "../middleware/authToken.js";
import {
  createEvent,
  getEventById,
  getEventsByOrganizerId,
  getAllEvents,
  updateEventById,
  deleteEventById,
} from "../controllers/eventController.js";

const router = expressRouter();

router.post("/:id", authToken, createEvent);
router.get("/:id", authToken, getEventById);
router.get("/organizer/:id", authToken, getEventsByOrganizerId);
router.get("/", authToken, getAllEvents);
router.put("/:id", authToken, updateEventById);
router.delete("/:id", authToken, deleteEventById);

export default router;
