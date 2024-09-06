import User from "../models/User.js";
import mongoose from "mongoose";
import { errorHandler } from "../middleware/errorHandler.js";

const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    const user = await User.findById(id);
    if (!user || user.isDeleted) {
      return next(errorHandler(400, "User not found!"));
    }

    const { password, __v, createdAt, deletedAt, isDeleted, ...newUser } =
      user._doc;

    res.status(200).json({ success: true, message: newUser });
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  const { username, bio, profileImage } = req.body;
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    if (!username && !bio && !profileImage) {
      return next(errorHandler(400, "Please provide relevant details!"));
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          username,
          bio,
          profileImage,
        },
      },
      { new: true }
    );

    if (!user) {
      return next(errorHandler(400, "User not found!"));
    }

    res
      .status(200)
      .json({ success: true, message: "User successfully updated" });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: true,
        },
      },
      { new: true }
    );

    if (!user) {
      return next(errorHandler(400, "User not found!"));
    }

    res
      .status(200)
      .json({ success: true, message: "User successfully deleted" });
  } catch (error) {
    next(error);
  }
};

export { updateUserById, deleteUserById, getUserById };
