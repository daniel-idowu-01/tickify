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

    const comment = await Comment.findById(id, {
      __v: 0,
      createdAt: 0,
      deletedAt: 0,
      updatedAt: 0,
      paidIds: 0,
      isDeleted: 0,
    });
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

const getCommentsByParentId = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    const comment = await Comment.find(
      {
        parentCommentId: id,
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
    if (!comment || comment.isDeleted) {
      return next(errorHandler(400, "Comment not found!"));
    }

    res.status(200).json({ success: true, message: comment });
  } catch (error) {
    next(error);
  }
};

const getAllCommentsByEventId = async (req, res, next) => {
  const { id } = req.params;
  try {
    const comments = await Comment.find(
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
    if (!comments || comments.isDeleted) {
      return next(errorHandler(400, "Comments not found!"));
    }

    res.status(200).json({ success: true, message: comments });
  } catch (error) {
    next(error);
  }
};

const deleteCommentById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    const comment = await Comment.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: true,
        },
      },
      { new: true }
    );

    if (!comment) {
      return next(errorHandler(400, "Comment not found!"));
    }

    res
      .status(200)
      .json({ success: true, message: "Comment successfully deleted" });
  } catch (error) {
    next(error);
  }
};

export {
  createComment,
  getCommentById,
  getCommentsByParentId,
  getAllCommentsByEventId,
  deleteCommentById,
};
