import User from "../models/authModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
import { check, validationResult } from "express-validator";

// Validation rules
const validateUser = [
  check("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Username is required!")
    .isLength({ min: 4, max: 20 }),
  check("phone")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Phone Number is required!")
    .isMobilePhone("any"),
  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Invalid email address"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// User Registration
const createUser = asyncHandler(async (req, res) => {
  const { username, phone, email, password } = req.body;

  // Check if email or phone already exists
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.status(400).send("Email already exists");
  }

  const phoneExists = await User.findOne({ phone });
  if (phoneExists) {
    return res.status(400).send("Phone number already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    phone,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      phone: newUser.phone,
      email: newUser.email,
      userType: newUser.isAdmin ? "A" : "C",
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res
      .status(400)
      .json({ message: "Invalid user data", error: error.message });
  }
});

const validateLogin = [
  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email is missing!")
    .isEmail()
    .withMessage("Invalid email address"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

// User Login with Rate Limiting
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(401).send("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) {
    return res.status(401).send("Invalid email or password");
  }

  createToken(res, existingUser._id);

  res.status(200).json({
    _id: existingUser._id,
    username: existingUser.username,
    phone: existingUser.phone,
    email: existingUser.email,
    userType: existingUser.isAdmin ? "A" : "C",
  });
});

// Logout
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// Get All Users (Admin Only)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json({
    success: true,
    message: "Users retrieved successfully",
    data: users,
  });
});

// Get Current User Profile
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });
  res.json({
    success: true,
    message: "User profile retrieved successfully",
    data: user,
  });
});

// Update User Profile
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const { username, phone, email, password } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).send("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).send("Incorrect password");
  }

  if (username) user.username = username;

  if (phone) {
    const phoneExists = await User.findOne({ phone });
    if (phoneExists && phoneExists._id.toString() !== user._id.toString()) {
      return res.status(400).send("Phone number already exists");
    }
    user.phone = phone;
  }

  if (email) {
    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists._id.toString() !== user._id.toString()) {
      return res.status(400).send("Email already exists");
    }
    user.email = email;
  }

  try {
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      phone: updatedUser.phone,
      email: updatedUser.email,
      userType: newUser.isAdmin ? "A" : "C",
    });
  } catch (error) {
    res.status(500).send("Error updating user");
  }
});

// Change Password with Validation
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const { id } = req.params;

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "New password and confirm password do not match" });
  }

  let user;

  if (req.user.isAdmin) {
    user = await User.findById(id);
  } else {
    user = await User.findById(req.user._id);
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Incorrect current password" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;

  await user.save();

  res.json({ message: "Password updated successfully" });
});

// Delete User
const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404).send("User not found.");
    return;
  }

  if (user.isAdmin) {
    res.status(400).send("Cannot delete admin user");
    return;
  }

  await User.deleteOne({ _id: user._id });
  res.json({ message: "User removed" });
});

// Get User by ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  res.json(user);
});

const updateUserById = asyncHandler(async (req, res) => {
  const { username, phone, email } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    user.username = username || user.username;
    user.phone = phone || user.phone;
    user.email = email || user.email;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      phone: updatedUser.phone,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res
      .status(400)
      .json({ message: "Error updating user", error: error.message });
  }
});

export {
  validateUser,
  handleValidationErrors,
  createUser,
  validateLogin,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  changePassword,
};
