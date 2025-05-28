import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { SubTask } from "../models/subTasks.models.js";
import { Task } from "../models/tasks.models.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import {
  usernameValidator,
  emailValidator,
  passwordValidator,
  contentValidator,
} from "../utils/validations.js";

// create a sub task
const createSubTask = asyncHandler(async (req, res) => {
  const { taskId, subTaskContent, dueAt } = req.body;

  let { priority } = req.body;
  priority = priority.toLowerCase().trim();

  const userId = req.user?._id;

  const ifTaskExists = await Task.findOne({ _id: taskId, owner: userId });

  if (!ifTaskExists) {
    throw new ApiError(400, "Main task or User doesnt exists");
  }

  if (priority !== "high" && priority !== "medium" && priority !== "low") {
    throw new ApiError(400, "Select the priority between low, medium and high");
  }

  const ifValid = contentValidator(subTaskContent);

  if (!ifValid) {
    throw new ApiError(400, "Content format not valid");
  }

  const subTask = await SubTask.create({
    subTaskContent,
    taskId,
    createdBy: userId,
    dueAt,
    priority,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, subTask, "Sub Task Added Successfully"));
});

export { createSubTask };
