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
import mongoose from "mongoose";

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

// get sub tasks for a particular task
const getAllSubTaskFromTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!taskId?.trim()) {
    throw new ApiError(400, "Main task not valid");
  }

  const subTaskList = await SubTask.aggregate([
    {
      $match: {
        taskId: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "tasks",
        localField: "taskId",
        foreignField: "_id",
        as: "main_task",
      },
    },
    {
      $unwind: "$main_task", // converts the array into an object
    },
    {
      $project: {
        subTaskContent: 1,
        dueAt: 1,
        priority: 1,
        "main_task.taskTitle": 1,
        "main_task._id": 1,
      },
    },
  ]);

  const subTaskCount = await SubTask.aggregate([
    {
      $match: {
        taskId: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $count: "numberOfSubTasks",
    },
  ]);

  if (!subTaskList) {
    throw new ApiError(404, "No sub tasks found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subTaskList, subTaskCount },
        "Sub tasks list fetched succesfully"
      )
    );
});

// mark sub task as complete
const toggleSubTaskStatus = asyncHandler(async (req, res) => {
  const { subTaskId } = req.params;

  const userId = req.user?._id;

  if (!subTaskId) {
    throw new ApiError(400, "Sub task id not valid");
  }

  const subTask = await SubTask.findOne({ _id: subTaskId, createdBy: userId });

  if (!subTask) {
    throw new ApiError(404, "Sub task not found");
  }

  const mainTaskId = subTask.taskId;

  subTask.isCompleted = !subTask.isCompleted;

  await subTask.save({ validateBeforeSave: false });

  // logic for auto status update of main task

  const subTaskStatusCount = await SubTask.aggregate([
    {
      $match: {
        taskId: new mongoose.Types.ObjectId(mainTaskId),
      },
    },
    {
      $facet: {
        taskCount: [
          {
            $count: "TotalTaskCount",
          },
        ],
        inCompletedTaskCount: [
          {
            $match: {
              isCompleted: false,
            },
          },
          {
            $count: "count",
          },
        ],
      },
    },
    {
      $project: {
        taskCount: {
          $ifNull: [
            {
              $arrayElemAt: ["$taskCount.TotalTaskCount", 0],
            },
            0,
          ],
        },
        inCompletedTaskCount: {
          $ifNull: [
            {
              $arrayElemAt: ["$inCompletedTaskCount.count", 0],
            },
            0,
          ],
        },
      },
    },
  ]);

  let totalSubTasksCount = subTaskStatusCount[0]?.taskCount;
  let inCompleteSubTasksCount = subTaskStatusCount[0]?.inCompletedTaskCount;

  // console.log(totalSubTasksCount, inCompleteSubTasksCount);

  let taskStatus; // No initial assignment, let the conditions determine it

  if (inCompleteSubTasksCount === 0) {
    // Scenario 1: All subtasks are complete
    taskStatus = "completed";
  } else if (inCompleteSubTasksCount === totalSubTasksCount) {
    // Scenario 2: All subtasks are incomplete
    taskStatus = "not started";
  } else if (
    inCompleteSubTasksCount > 0 &&
    inCompleteSubTasksCount < totalSubTasksCount
  ) {
    // Scenario 3: Some subtasks are incomplete, some are complete
    taskStatus = "in progress";
  } else {
    // Fallback for unexpected scenarios (e.g., negative counts, or logic errors)
    throw new ApiError(400, "check the main task update logic !!!");
  }

  console.log(`Main task status: ${taskStatus}`);

  const mainTask = await Task.findOneAndUpdate(
    { _id: mainTaskId, owner: userId },
    { taskStatus },
    {
      new: true,
      projection: { _id: 1, taskStatus: 1 }, // Only return _id and taskStatus
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { subTask, mainTask }, "Task status toggled"));
});

export {
  createSubTask,
  updateSubTask,
  deleteSubTask,
  fetchSubTask,
  getAllSubTaskFromTask,
  toggleSubTaskStatus,
};

/*
const toggleSubTaskStatus = asyncHandler(async (req, res) => {
  const { subTaskId } = req.params;
  const userId = req.user?._id;

  if (!subTaskId) {
    throw new ApiError(400, "Sub task id not valid");
  }

  const subTask = await SubTask.findOne({ _id: subTaskId, createdBy: userId });

  if (!subTask) {
    throw new ApiError(404, "Sub task not found");
  }

  const mainTaskId = subTask.taskId;

  subTask.isCompleted = !subTask.isCompleted;
  await subTask.save({ validateBeforeSave: false });

  // Fetch counts
  const [totalCount, incompleteCount] = await Promise.all([
    SubTask.countDocuments({ taskId: mainTaskId }),
    SubTask.countDocuments({ taskId: mainTaskId, isCompleted: false }),
  ]);

  // Determine status
  let taskStatus = "not started";
  if (incompleteCount === 0 && totalCount > 0) {
    taskStatus = "completed";
  } else if (incompleteCount < totalCount) {
    taskStatus = "in progress";
  }

  await Task.findByIdAndUpdate(
    mainTaskId,
    { taskStatus },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, subTask, "Task status toggled"));
});


------------------------------------------------------------------------
const incompletedTask = await SubTask.aggregate([
    [
      {
        $match: {
          taskId: new mongoose.ObjectId(mainTaskId),
        },
      },
      {
        $facet: {
          totalSubTasks: [{ $count: "count" }],
          incompleteSubTasks: [
            { $match: { isCompleted: false } },
            { $count: "count" },
          ],
        },
      },
      {
        $addFields: {
          totalSubTasks: {
            $ifNull: [{ $arrayElemAt: ["$totalSubTasks.count", 0] }, 0],
          },
          incompleteSubTasks: {
            $ifNull: [{ $arrayElemAt: ["$incompleteSubTasks.count", 0] }, 0],
          },
        },
      },
    ],
  ]);



  const totalSubTasks = incompletedTask.totalSubTasks;
  let totalIncompleteSubTasks = incompletedTask.incompleteSubTasks;

  let taskStatus = "not started";

  if (totalIncompleteSubTasks === 0) {
    taskStatus = "completed";
  } else if (
    totalIncompleteSubTasks > 0 &&
    totalIncompleteSubTasks < totalSubTasks
  ) {
    taskStatus = "in progress";
  } else {
    taskStatus = "not started";
  }
  const mainTask = await Task.findByIdAndUpdate(
    mainTaskId,
    {
      taskStatus: taskStatus,
    },
    { new: true }
  );

*/
