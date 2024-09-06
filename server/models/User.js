import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    username: {
      type: String,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    phoneNumber: {
      type: String
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    bio: {
      type: String
    },
    googleId: {
      type: String
    },
    isDeleted: {
      type: Boolean
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
