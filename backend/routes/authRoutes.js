import express from "express";
import {
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
} from "../controllers/authController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import limiter from "../middlewares/rateLimiter.js";

const router = express.Router();

router
  .route("/")
  .post(validateUser, handleValidationErrors, createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);

router.post("/auth", limiter, validateLogin, handleValidationErrors, loginUser); 
router.post("/logout", logoutCurrentUser);

router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

router.put("/profile/password", authenticate, changePassword);

router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserById)
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById);

export default router;
