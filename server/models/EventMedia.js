import mongoose from "mongoose";

const eventMediaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    media: {
      type: [String],
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("EventMedia", eventMediaSchema);
