import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  usernameValidator,
  emailValidator,
  passwordValidator,
} from "../utils/validations.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details
  const { username, email, password } = req.body;

  // validations
  if (!usernameValidator(username)) {
    throw new ApiError(400, "Invalid Username");
  }

  if (!emailValidator(email)) {
    throw new ApiError(400, "Invalid email");
  }

  if (!passwordValidator(password)) {
    throw new ApiError(
      400,
      "Invalid Password. Passwords must have One capital letter, one special character and atleast one number"
    );
  }

  // check if user exists of not
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  // get file
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadToCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "upload of Avatar to cloudinary failed");
  }

  // create user entry in DB

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar?.url || "",
  });

  // check if user is created

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the User");
  }

  // send response back
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created Successfully"));
});

export { registerUser };
