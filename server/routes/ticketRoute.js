import expressRouter from "express";
import { authToken } from "../middleware/authToken.js";
import {
  createTicket,
  getTicketById,
  validateTicket,
  getAllTicketsByEventId,
  expireTicketById,
  deleteTicketById,
} from "../controllers/ticketController.js";

const router = expressRouter();

router.post("/", authToken, createTicket);
router.get("/:id", authToken, getTicketById);
router.get("/validate/", authToken, validateTicket);
router.get("/event/:id", authToken, getAllTicketsByEventId);
router.put("/:id", authToken, expireTicketById);
router.delete("/:id", authToken, deleteTicketById);

export default router;
