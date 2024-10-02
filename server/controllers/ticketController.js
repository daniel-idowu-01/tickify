import mongoose from "mongoose";
import User from "../models/User.js";
import Event from "../models/Event.js";
import Ticket from "../models/Ticket.js";
import { errorHandler } from "../middleware/errorHandler.js";
import { isEmpty } from "../utils/helpers.js";

const createTicket = async (req, res, next) => {
  let user, event, tickets;
  try {
    const { userId, eventId, username, firstName, lastName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(errorHandler(400, "Input valid User ID"));
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return next(errorHandler(400, "Input valid Event ID"));
    }

    user = await User.findById(userId);
    event = await Event.findById(eventId);
    tickets = await Ticket.find({ eventId });
    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }
    if (!event) {
      return next(errorHandler(404, "Event not found!"));
    }

    const hasTicket = tickets.some((ticket) => ticket.userId.equals(user._id));

    if (hasTicket) {
      return next(errorHandler(400, "Only one ticket per user!"));
    }

    const createdTicket = await Ticket.create({
      userId: user._id,
      eventId,
      firstName,
      lastName,
      username,
    });

    if (!createdTicket) {
      return next(errorHandler(400, "Ticket not created"));
    }

    return res
      .status(201)
      .json({ success: true, data: "Ticket created successfully!" });
  } catch (error) {
    next(error);
  }
};

const getTicketById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    const ticket = await Ticket.findById(id, {
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    });
    if (!ticket || ticket.isDeleted) {
      return next(errorHandler(400, "Ticket not found!"));
    }

    if (ticket.isExpired || isTicketExpired(ticket)) {
      return next(errorHandler(400, "Ticket is expired!"));
    }

    const { isDeleted, deletedAt, isUsed, isExpired, ...newTicket } =
      ticket._doc;

    res.status(200).json({ success: true, data: newTicket });
  } catch (error) {
    next(error);
  }
};

const validateTicket = async (req, res, next) => {
  const { ticketId } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    const ticket = await Ticket.findById(ticketId, {
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    });

    if (!ticket || ticket.isDeleted) {
      return next(errorHandler(404, "Ticket not found!"));
    }

    const event = await Event.findById(ticket.eventId);
    if (!event) {
      return next(errorHandler(404, "Event not found"));
    }

    if (ticket.isUsed) {
      return next(errorHandler(400, "Ticket has already been used!"));
    }

    await Ticket.findByIdAndUpdate(
      ticket._id,
      {
        $set: {
          isUsed: true,
        },
      },
      { new: true }
    );

    return res.status(200).json({ success: true, data: "Ticket is valid" });
  } catch (error) {
    next(error);
  }
};

const getAllTicketsByEventId = async (req, res, next) => {
  const { id } = req.params;
  try {
    const tickets = await Ticket.find(
      {
        eventId: id,
      },
      {
        __v: 0,
        createdAt: 0,
        deletedAt: 0,
        updatedAt: 0,
        paidIds: 0,
        isDeleted: 0,
      }
    );

    const empty = isEmpty(tickets);
    if (empty) {
      return next(errorHandler(400, "No tickets for this event!"));
    }

    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    next(error);
  }
};

const expireTicketById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      {
        $set: {
          isExpired: true,
          expiredAt: new Date(),
        },
      },
      { new: true }
    );

    if (!ticket) {
      return next(errorHandler(400, "Ticket not found!"));
    }

    res.status(200).json({ success: true, data: "Ticket is expired!!!" });
  } catch (error) {
    next(error);
  }
};

const deleteTicketById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!ticket) {
      return next(errorHandler(400, "Ticket not found!"));
    }

    res
      .status(200)
      .json({ success: true, data: "Ticket successfully deleted" });
  } catch (error) {
    next(error);
  }
};

const isTicketExpired = (ticket) => {
  return new Date() > ticket.expiredAt;
};

export {
  createTicket,
  getTicketById,
  validateTicket,
  getAllTicketsByEventId,
  expireTicketById,
  deleteTicketById,
};
