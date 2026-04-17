import express from "express";

const resumeRouter = express.Router();
import { createResume, deleteResume, getPublicResumeById, getResumeById, updateResume } from "../controllers/resumeController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";


resumeRouter.post('/create', protect, createResume);
resumeRouter.put('/update', upload.single('image'), protect, updateResume);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeById);
resumeRouter.get('/public/:resumeId', getPublicResumeById);
export default resumeRouter;
