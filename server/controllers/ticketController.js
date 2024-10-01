import mongoose from "mongoose";
import User from "../models/User.js";
import Event from "../models/Event.js";
import Ticket from "../models/Ticket.js";
import { errorHandler } from "../middleware/errorHandler.js";

const createTicket = async (req, res, next) => {
  let user, event;
  try {
    const { username, firstName, lastName } = req.body;
    const { userId, eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(errorHandler(400, "Input valid User ID"));
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return next(errorHandler(400, "Input valid Event ID"));
    }

    user = await User.findById(userId);
    event = await User.findById(eventId);
    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }
    if (!event) {
      return next(errorHandler(404, "Event not found!"));
    }

    const createdTicket = await Ticket.create({
      userId: user._id,
      firstName,
      lastName,
      username,
      eventId,
    });

    if (!createdTicket) {
      return next(errorHandler(400, "Ticket not created"));
    }

    return res
      .status(201)
      .json({ success: true, message: "Ticket created successfully!" });
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
      deletedAt: 0,
      updatedAt: 0,
      isDeleted: 0,
    });
    if (!ticket || ticket.isDeleted) {
      return next(errorHandler(400, "Ticket not found!"));
    }

    if (ticket.isExpired || isTicketExpired(ticket)) {
      return next(errorHandler(400, "Ticket is expired!"));
    }

    const {
      __v,
      createdAt,
      updatedAt,
      isDeleted,
      deletedAt,
      userId,
      eventId,
      ...newTicket
    } = ticket._doc;

    res.status(200).json({ success: true, message: newTicket });
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
      deletedAt: 0,
      updatedAt: 0,
      isDeleted: 0,
    });

    if (!ticket) {
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

    return res.status(200).json({ success: true, message: "Ticket is valid" });
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
    console.log("All Tickets", tickets);
    if (!tickets || tickets.isDeleted) {
      return next(errorHandler(400, "tickets not found!"));
    }

    res.status(200).json({ success: true, message: tickets });
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

    res.status(200).json({ success: true, message: "Ticket is expired!!!" });
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
      .json({ success: true, message: "Ticket successfully deleted" });
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
