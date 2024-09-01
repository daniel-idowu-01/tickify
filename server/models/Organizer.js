import mongoose from "mongoose";

const organizerSchema = new mongoose.Schema(
  {
    name: {
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
    phoneNumberVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Organizer", organizerSchema);
