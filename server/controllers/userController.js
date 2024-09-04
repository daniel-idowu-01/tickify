import User from "../models/User.js";
import mongoose from "mongoose";
import { errorHandler } from "../middleware/errorHandler.js";

const updateUserById = async (req, res, next) => {
  const { username, bio, profileImage } = req.body;
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Input valid ID"));
    }

    if(!username && !bio && !profileImage) {
      return next(errorHandler(400, "Please provide relevant details!"))
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          username,
          bio,
          profileImage
        },
      },
      { new: true });
    
    if (!user) {
      return next(errorHandler(400, "User not found!"))
    }
    
    res.status(200).json({ success: true, message: 'User successfully updated'});
  } catch (error) {
    next(error)
  }
};

export { updateUserById };
