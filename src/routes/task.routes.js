import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.middlewares.js";
import {
  createMainTask,
  deleteTask,
  getTask,
  updateTask,
  updateTaskStatus,
  getAllTask,
  archiveTask,
} from "../controllers/task.controllers.js";

const router = Router();

// create a task
router.route("/create-task").post(verifyJWT, createMainTask);

// read a task
router.route("/get-task/:taskId").get(verifyJWT, getTask);

// update a task
router.route("/update-task/:taskId").post(verifyJWT, updateTask);

// delete a task
router.route("/delete-task/:taskId").post(verifyJWT, deleteTask);

// change task status to complete
router.route("/change-task-status/:taskId").post(verifyJWT, updateTaskStatus);

// change task status to archived
router.route("/archive-task/:taskId").post(verifyJWT, updateTaskStatus);

// change task status to complete
router.route("/get-all-tasks").get(verifyJWT, getAllTask);

export default router;
