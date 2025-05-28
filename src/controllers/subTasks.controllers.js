import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { SubTask } from "../models/subTasks.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  usernameValidator,
  emailValidator,
  passwordValidator,
} from "../utils/validations.js";

// create a sub task
const createSubTask = asyncHandler(async (req, res) => {});

export { createSubTask };
