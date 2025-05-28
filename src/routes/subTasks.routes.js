import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.middlewares.js";

import { createSubTask } from "../controllers/subTasks.controllers.js";

const router = Router();

// create sub Task

router.route("/create-sub-task").post(verifyJWT, createSubTask);

export default router;
