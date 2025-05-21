import { asyncHandler } from "../utils/asyncHandler.js";
import { validateUserInput } from "../utils/validations.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
});
