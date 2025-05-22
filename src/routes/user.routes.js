import { registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { Router } from "express";

const router = Router();

router.route("/register-user").post(upload.single("avatar"), registerUser);

export default router;
