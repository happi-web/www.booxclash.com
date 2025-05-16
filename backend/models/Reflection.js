import mongoose from "mongoose";

const reflectionSchema = new mongoose.Schema(
  {
    prompt: { type: [String], required: true }, // make prompt an array of strings
    response: { type: String, required: true },
    studentId: { type: String }, // Optional: link to user if needed
  },
  { timestamps: true }
);

export default mongoose.model("Reflection", reflectionSchema);
