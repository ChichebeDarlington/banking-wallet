import express from "express";
import {
  getAllUser,
  login,
  forgotPassword,
  resetPassword,
  register,
  userInfo,
  verifyUser,
  updateUserProfile,
  verifyEmail,
} from "../controllers/userController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", register);
router.post("/verify-email", verifyEmail);
router.post("/signin", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:_id/:token", resetPassword);
router.get("/user-info", auth, userInfo);
router.get("/get-users", auth, getAllUser);
router.get("/get-users", auth, getAllUser);
router.patch("/verify-users", auth, verifyUser);
router.patch("/update-user-profile", auth, updateUserProfile);

export default router;
