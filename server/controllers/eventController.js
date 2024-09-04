import mongoose from "mongoose";
import Organizer from "../models/Organizer.js";
import Event from "../models/Event.js";
import { errorHandler } from "../middleware/errorHandler.js";

const createEvent = async (req, res, next) => {
  let organizer;
  const { eventImage, eventName, location, mode } = req.body;
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    organizer = await Organizer.findById(id);
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

export { createEvent };
