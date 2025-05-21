import mongoose, { Schema } from "mongoose";

const subTaskSchema = new Schema(
  {
    subTaskContent: {
      type: String,
      required: true,
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const SubTask = mongoose.model("SubTask", subTaskSchema);
