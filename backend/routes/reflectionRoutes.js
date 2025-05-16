import express from "express";
import { submitReflection } from "../controllers/reflectionController.js";

const router = express.Router();

router.post("/submit", submitReflection);

export default router;
