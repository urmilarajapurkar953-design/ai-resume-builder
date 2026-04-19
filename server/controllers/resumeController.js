import imagekit from "../config/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";
import axios from "axios";

// CREATE RESUME
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    const newResume = await Resume.create({
      userId,
      title,
    });

    return res.status(201).json({
      message: "Resume created successfully",
      resume: newResume,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error occurred while creating resume",
    });
  }
};

// DELETE RESUME
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    await Resume.findOneAndDelete({ _id: resumeId, userId });

    return res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error occurred while deleting resume",
    });
  }
};

// GET RESUME (PRIVATE)
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ _id: resumeId, userId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({
      message: "Error occurred while fetching resume",
    });
  }
};

// GET PUBLIC RESUME
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({
      public: true,
      _id: resumeId,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({
      message: "Error occurred while fetching resume",
    });
  }
};
const removeBgFromImage = async (filePath) => {
  try {
    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      {
        image_file_b64: fs.readFileSync(filePath, { encoding: "base64" }),
        size: "auto",
      },
      {
        headers: {
          "X-Api-Key": process.env.REMOVE_BG_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    const outputPath = filePath + "-no-bg.png";
    fs.writeFileSync(outputPath, response.data);

    return outputPath;

  } catch (error) {
    console.log("Remove.bg Error:", error.message);
    return filePath; // fallback original
  }
};

// UPDATE RESUME
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    let resumeDataCopy;

    if (typeof resumeData === "string") {
      resumeDataCopy = JSON.parse(resumeData);
    } else {
      resumeDataCopy = structuredClone(resumeData);
    }

    // ✅ existing image
    let imageUrl = resumeDataCopy.personal_info?.image || "";

if (image || (removeBackground == true || removeBackground === "true")) {  let filePath = image.path;

  // ✅ APPLY BACKGROUND REMOVE
  console.log("REMOVE BG VALUE:", removeBackground);
if (removeBackground == true || removeBackground === "true") {    filePath = await removeBgFromImage(filePath);
  }

  try {
    const response = await imagekit.upload({
      file: fs.readFileSync(filePath),
      fileName: "resume.png",
      folder: "user-resumes",
    });

    imageUrl = response.url;

  } catch (err) {
    console.log("Upload Error:", err.message);
  }
}

    // ✅ safe assign
    if (!resumeDataCopy.personal_info) {
      resumeDataCopy.personal_info = {};
    }

    resumeDataCopy.personal_info.image = imageUrl;

    // ✅ update DB
    const resume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId },
      resumeDataCopy,
      { returnDocument: "after" }
    );

    return res.status(200).json({
      message: "Resume updated successfully",
      resume,
    });

  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Error occurred while updating resume",
    });
  }
};