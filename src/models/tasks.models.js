import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    taskTitle: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    taskStatus: {
      type: String,
      enum: ["not started", "in progress", "completed", "archived"],
      default: "not started",
      required: true,
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
