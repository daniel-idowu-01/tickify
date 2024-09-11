import mongoose from "mongoose";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import { errorHandler } from "../middleware/errorHandler.js";

const createComment = async (req, res, next) => {
  let user;
  const { comment, profileImage, username } = req.body;
  const { userId, eventId, parentCommentId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    user = await User.findById(userId);
    const createdComment = await Comment.create({
      userId: user._id,
      comment,
      profileImage,
      username,
      eventId,
      parentCommentId,
    });

    if (!createdComment) {
      return next(errorHandler(400, "Comment not added"));
    }

    return res
      .status(201)
      .json({ success: true, message: "Comment added successfully!" });
  } catch (error) {
    next(error);
  }
};

const getCommentById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    const comment = await Comment.findById(id);
    if (!comment || comment.isDeleted) {
      return next(errorHandler(400, "Comment not found!"));
    }

    const {
      organizerId,
      __v,
      createdAt,
      updatedAt,
      isDeleted,
      userId,
      eventId,
      parentCommentId,
      ...newComment
    } = comment._doc;

    res.status(200).json({ success: true, message: newComment });
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
  createComment,
  getCommentById,
  getEventsByOrganizerId,
  getAllEvents,
  updateEventById,
  deleteEventById,
};
