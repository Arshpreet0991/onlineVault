import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.middlewares.js";

import {
  createSubTask,
  updateSubTask,
} from "../controllers/subTasks.controllers.js";

const router = Router();

// create sub Task
router.route("/create-sub-task").post(verifyJWT, createSubTask);

// update a sub task
router.route("/:subTaskId").put(verifyJWT, updateSubTask);

export default router;
