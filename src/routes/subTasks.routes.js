import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.middlewares.js";

import {
  createSubTask,
  updateSubTask,
  deleteSubTask,
  fetchSubTask,
  getAllSubTaskFromTask,
} from "../controllers/subTasks.controllers.js";

const router = Router();

// create sub Task
router.route("/create-sub-task").post(verifyJWT, createSubTask);

// update a sub task
router.route("/:subTaskId").put(verifyJWT, updateSubTask);

// delete a sub task
router.route("/:subTaskId").delete(verifyJWT, deleteSubTask);

// fetch a sub task
router.route("/:subTaskId").get(verifyJWT, fetchSubTask);

// get a sub task list of a main task
router.route("/:taskId").get(verifyJWT, getAllSubTaskFromTask);

export default router;
