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
  const { taskId, dueAt } = req.body;

  let { subTaskContent, priority } = req.body;
  priority = priority.toLowerCase().trim();
  subTaskContent = subTaskContent.trim();

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

// update a sub task
const updateSubTask = asyncHandler(async (req, res) => {
  const { dueAt } = req.body;

  let { subTaskContent, priority } = req.body;

  // Validate presence
  if (!subTaskContent || !priority) {
    throw new ApiError(400, "SubTask content and priority are required");
  }

  priority = priority.toLowerCase().trim();
  subTaskContent = subTaskContent.trim();

  // Optional: Validate priority value
  const validPriorities = ["high", "medium", "low"];
  if (!validPriorities.includes(priority)) {
    throw new ApiError(400, "Priority must be 'low', 'medium', or 'high'");
  }

  const { subTaskId } = req.params;
  const userId = req.user?._id;

  const updatedSubTask = await SubTask.findOneAndUpdate(
    { _id: subTaskId, createdBy: userId },
    {
      subTaskContent,
      dueAt,
      priority,
    },
    { new: true }
  );

  if (!updatedSubTask) {
    throw new ApiError(400, "Could not find the sub task or update failed");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedSubTask, "Sub Task updated successfully")
    );
});

// delete a sub task
const deleteSubTask = asyncHandler(async (req, res) => {
  const { subTaskId } = req.params;

  const userId = req.user?._id;

  if (!subTaskId) {
    throw new ApiError(400, "sub task id not valid");
  }

  const subTaskToDelete = await SubTask.findOneAndDelete({
    _id: subTaskId,
    createdBy: userId,
  });

  if (!subTaskToDelete) {
    throw new ApiError(404, "Sub task not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, subTaskToDelete, "Sub task deleted succesfully")
    );
});

// fetch a sub task
const fetchSubTask = asyncHandler(async (req, res) => {
  const { subTaskId } = req.params;
  const userId = req.user?._id;

  if (!subTaskId) {
    throw new ApiError(400, "Sub task id not valid");
  }

  const subTask = await SubTask.findOne({ _id: subTaskId, createdBy: userId });

  if (!subTask) {
    throw new ApiError(404, "Sub task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subTask, "sub task fetched successfully"));
});

export { createSubTask, updateSubTask, deleteSubTask, fetchSubTask };
