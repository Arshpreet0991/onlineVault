import { Task } from "../models/tasks.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { contentValidator } from "../utils/validations.js";

// create task
const createMainTask = asyncHandler(async (req, res) => {
  let { taskTitle } = req.body;

  if (!taskTitle) {
    throw new ApiError(400, "Task Title is required");
  }

  taskTitle = taskTitle.trim();

  const taskValidation = contentValidator(taskTitle);
  if (!taskValidation) {
    throw new ApiError(400, "Task Title Format is invalid");
  }

  const task = await Task.create({
    taskTitle,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created Successfully"));
});

// read a task/ get task
const getTask = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;

  const userId = req.user?._id;

  const task = await Task.findOne({ _id: taskId, owner: userId });
  if (!task) {
    throw new ApiError(404, "Task not Found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task Fetched Successfully"));
});

// update a task
const updateTask = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;

  const userId = req.user?._id;

  let { taskTitle } = req.body;

  taskTitle = taskTitle.trim();

  const veriftTaskFormat = contentValidator(taskTitle);

  if (!veriftTaskFormat) {
    throw new ApiError(400, "Task Title format is not Valid");
  }

  const updatedTask = await Task.findOneAndUpdate(
    { _id: taskId, owner: userId },
    {
      $set: {
        taskTitle,
      },
    },
    { new: true }
  );

  if (!updatedTask) {
    throw new ApiError(404, "Task not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task Title Updated"));
});

// delete a task
const deleteTask = asyncHandler(async (req, res) => {
  const taskId = req.params?.taskId;

  const userId = req.user?._id;

  const task = await Task.findOne({ _id: taskId, owner: userId }); // find the task by task id and ownerId. This ensures that the task being selected belongs to the correct user.

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await Task.deleteOne({ _id: taskId });

  return res.status(200).json(new ApiResponse(200, {}, "Task Deleted"));
});

// manually update Task Status
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user?._id;

  const task = await Task.findOneAndUpdate(
    { _id: taskId, owner: userId },
    {
      $set: {
        taskStatus: "completed",
      },
    },
    { new: true }
  );

  if (!task) {
    throw new ApiError(404, "task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task status changed to complete"));
});
export { createMainTask, getTask, updateTask, deleteTask, updateTaskStatus };
