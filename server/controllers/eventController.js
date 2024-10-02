import mongoose from "mongoose";
import Organizer from "../models/Organizer.js";
import Event from "../models/Event.js";
import { errorHandler } from "../middleware/errorHandler.js";
import Ticket from "../models/Ticket.js";

const createEvent = async (req, res, next) => {
  let organizer;
  const { eventImage, eventName, location, mode } = req.body;
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    organizer = await Organizer.findById(id);
    if (!organizer) {
      return next(errorHandler(400, "Organizer not found!"));
    }

    const event = await Event.create({
      organizerId: organizer._id,
      eventImage,
      eventName,
      location,
      mode,
    });

    if (!event) {
      return next(errorHandler(400, "Event not created"));
    }

    return res
      .status(201)
      .json({ success: true, message: "Event created successfully!" });
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    const event = await Event.findById(id);
    if (!event || event.isDeleted) {
      return next(errorHandler(400, "Event not found!"));
    }

    const attendees = await Ticket.countDocuments({ eventId: event._id });
    console.log("attendees", attendees);

    const {
      organizerId,
      __v,
      createdAt,
      deletedAt,
      updatedAt,
      paidIds,
      isDeleted,
      ...newEvent
    } = event._doc;

    newEvent.attendees = attendees

    res.status(200).json({ success: true, message: newEvent });
  } catch (error) {
    next(error);
  }
};

const getEventsByOrganizerId = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    const event = await Event.find(
      {
        organizerId: id,
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
    if (!event || event.isDeleted) {
      return next(errorHandler(400, "Event not found!"));
    }

    res.status(200).json({ success: true, message: event });
  } catch (error) {
    next(error);
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find(
      {},
      {
        __v: 0,
        createdAt: 0,
        deletedAt: 0,
        updatedAt: 0,
        paidIds: 0,
        isDeleted: 0,
      }
    );
    if (!events || events.isDeleted) {
      return next(errorHandler(400, "Event not found!"));
    }

    res.status(200).json({ success: true, message: events });
  } catch (error) {
    next(error);
  }
};

const updateEventById = async (req, res, next) => {
  const { eventImage, eventName, location, eventAddress, mode } = req.body;
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    if ((!eventImage, !eventName, !location, !eventAddress, !mode)) {
      return next(errorHandler(400, "Please provide relevant details!"));
    }

    const event = await Event.findByIdAndUpdate(
      id,
      {
        $set: {
          eventImage,
          eventName,
          location,
          eventAddress,
          mode,
        },
      },
      { new: true }
    );

    if (!event) {
      return next(errorHandler(400, "Event not found!"));
    }

    res
      .status(200)
      .json({ success: true, message: "Event successfully updated" });
  } catch (error) {
    next(error);
  }
};

const deleteEventById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    const event = await Event.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: true,
        },
      },
      { new: true }
    );

    if (!event) {
      return next(errorHandler(400, "Event not found!"));
    }

    res
      .status(200)
      .json({ success: true, message: "Event successfully deleted" });
  } catch (error) {
    next(error);
  }
};

export {
  createEvent,
  getEventById,
  getEventsByOrganizerId,
  getAllEvents,
  updateEventById,
  deleteEventById,
};
