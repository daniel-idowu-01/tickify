import User from "../models/User.js";
import bcrypt from "bcrypt";
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

const getAllUsers = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.id);

    if (!admin || admin.isDeleted || admin.id !== process.env.ADMIN_ID) {
      return next(errorHandler(401, "Unauthorized!"));
    }

    const users = await User.find({});
    if (!users || users.isDeleted) {
      return next(errorHandler(400, "Users not found!"));
    }

    res.status(200).json({ success: true, message: users });
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

const changeUserPassword = async (req, res, next) => {
  let passwordMatch;
  const { password } = req.body;
  const { id } = req.user;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    if (!password) {
      return next(errorHandler(400, "Please provide relevant details!"));
    }
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT)
    );

    const userPassword = await User.findById(id).select("password");

    passwordMatch = await bcrypt.compare(password, userPassword.password);

    if (passwordMatch) {
      return next(
        errorHandler(400, "Old password cannot be used as new password!")
      );
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );

    if (!user) {
      return next(errorHandler(400, "User not found!"));
    }

    res
      .status(200)
      .json({ success: true, message: "User password successfully updated" });
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

export {
  updateUserById,
  deleteUserById,
  getUserById,
  changeUserPassword,
  getAllUsers,
};
