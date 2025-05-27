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
      enum: ["not started", "in progress", "completed", "archieved"],
      default: "not started",
      required: true,
    },
    subTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubTask",
      }, // array of sub Tasks
    ],
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
