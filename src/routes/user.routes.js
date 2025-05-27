import {
  loginUser,
  registerUser,
  logoutUser,
  getUser,
  changePassword,
  updateAccountDetails,
  updateAvatar,
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

// get current user
router.route("/get-current-user").get(verifyJWT, getUser);

// Change current password
router.route("/change-password").get(verifyJWT, changePassword);

// update account details
router.route("/update-account-details").get(verifyJWT, updateAccountDetails);

// update account Avatar
router
  .route("/update-avatar")
  .get(verifyJWT, upload.single("avatar"), updateAvatar);
export default router;
