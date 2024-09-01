import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer",
      required: true,
    },
    eventImage: {
      type: String,
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      enum: ["physical", "online"],
      required: true,
    },
    eventAddress: {
      type: String,
      required: function () {
        return this.location === "physical"
      },
    },
    mode: {
      type: String,
      enum: ["free", "paid"],
      required: true,
    },
    paidIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
