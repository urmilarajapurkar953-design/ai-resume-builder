import imagekit from "../config/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";

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

    // ✅ upload new image
    if (image) {
      try {
        const response = await imagekit.upload({
          file: fs.readFileSync(image.path),
          fileName: "resume.png",
          folder: "user-resumes",
        });

        imageUrl = response.url;
      } catch (err) {
        console.log("Upload Error:", err.message);
      }
    }

    // ✅ background remove
    // 🔴 TEMP DISABLED (causing issue)
// if (removeBackground === "true" && imageUrl) {
//   try {
//     const url = new URL(imageUrl);
//     const path = url.pathname;

//     imageUrl = imagekit.url({
//       path: path,
//       transformation: [{ effect: "bgremove" }],
//     });

//   } catch (err) {
//     console.log("BG Remove Error:", err.message);
//   }
// }

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