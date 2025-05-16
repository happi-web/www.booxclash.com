import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  saveLessonContent,
  getLessonContent,
  getAllLessonContent,
  deleteLessonContent,
} from "../controllers/lessonContentController.js";

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config for image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedFilename = file.originalname.replace(/\s+/g, "_");
    cb(null, `${timestamp}-${sanitizedFilename}`);
  },
});

const upload = multer({ storage });

// Upload image and return its URL
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

// Create or update lesson content
router.post("/save", saveLessonContent);

// Get a specific lesson
router.get("/get", getLessonContent);

// Get all lesson content
router.get("/get-all", getAllLessonContent);

// Delete a specific lesson
router.delete("/delete", deleteLessonContent);

export default router;
