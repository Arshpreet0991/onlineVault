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

// generate Access and Refresh Token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong whilte generating Access and Refresh Tokens"
    );
  }
};

// options for secure-cookie
const options = {
  httpOnly: true,
  secure: true,
};

// register user
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

  let avatarUrl = "";

  if (req.file?.path) {
    const avatar = await uploadToCloudinary(req.file?.path);

    if (!avatar) {
      throw new ApiError(400, "upload of Avatar to cloudinary failed");
    }
    avatarUrl = avatar.url;
  }

  // create user entry in DB

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatarUrl,
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

// login user
const loginUser = asyncHandler(async (req, res) => {
  // get data from from front end

  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required to login");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "user with this email doesnt exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "incorrect password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200, // status
        { user: loggedInUser, accessToken, refreshToken }, // data
        "User Logged in Successfully" // message
      )
    );
});

// logout User
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

export { registerUser, loginUser, logoutUser };
