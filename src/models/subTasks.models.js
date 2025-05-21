import mongoose, { Schema } from "mongoose";

const subTasksSchema = new Schema(
  {
    subTaskTitle: {
      type: String,
      required: true,
    },
    subTaskContent: {
      type: String,
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

export const SubTask = mongoose.model("SubTask", subTasksSchema);
