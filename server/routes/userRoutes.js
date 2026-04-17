import express from "express";
import * as userController from "../controllers/UserController.js";
import protect from "../middleware/authMiddleware.js";

const userRouter = express.Router();

// AUTH
userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.loginUser);

// USER DATA
userRouter.get("/data", protect, userController.getUserById);

// ⚠️ TEMP COMMENT THIS (CAUSE OF ERROR)
 userRouter.get("/resumes", protect, userController.getUserResume);

// FORGOT PASSWORD
userRouter.post("/forgot-password", userController.forgotPassword);
userRouter.post("/reset-password", userController.resetPassword);

export default userRouter;