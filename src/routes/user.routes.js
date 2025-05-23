import {
  loginUser,
  registerUser,
  logoutUser,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.middlewares.js";

const router = Router();

// register user
router.route("/register-user").post(upload.single("avatar"), registerUser);
// login user
router.route("/login").post(loginUser);

/***********  SECURED ROUTES *****************/
// logout user
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
