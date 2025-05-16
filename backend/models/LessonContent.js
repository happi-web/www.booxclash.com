import mongoose from "mongoose";
// Schema for "Start" (Spark Curiosity) section
const StartSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["text-prompt", "multiple-choice", "image", "video", "riddle"],
    required: true,
  },
  prompt: { type: String }, // e.g., a riddle or question
  options: [String],        // for multiple-choice
  correctAnswer: { type: String }, // for text or multiple-choice
  image: { type: String },  // URL or path
  videoLink: { type: String }, // YouTube or other embed link
});

// Schema for individual quiz questions
const QuizQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ["short-answer", "multiple-choice"],
    required: true,
  },
  question: { type: String, required: true },
  options: [String], // Only for multiple-choice
  answer: { type: String, required: true },
});

// Schema for "Know" questions
const KnowQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ["short-answer", "multiple-choice", "visual"],
    required: true,
  },
  prompt: { type: String, required: true },
  explanation: { type: String },
  options: [String],
  correctAnswer: { type: String },
  suggestedAnswers: [String],
  image: { type: String },
});

// Schema for "Watch" content
const WatchContentSchema = new mongoose.Schema({
  videoLink: { type: String, required: true },
  explanation: { type: String, required: true },
});

// Main lesson content schema
const LessonContentSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    level: { type: Number, required: true },
    start: StartSchema,
    knowQuestions: [KnowQuestionSchema],
    doComponent: { type: String },
    watchContent: WatchContentSchema,

    // ✅ Changed from string to array of strings
    reflectPrompt: { type: [String], default: [] },

    quiz: [QuizQuestionSchema],
  },
  { timestamps: true }
);

// ✅ Enforce uniqueness based on subject + topic + level
LessonContentSchema.index({ subject: 1, topic: 1, level: 1 }, { unique: true });

const LessonContent =
  mongoose.models.LessonContent || mongoose.model("LessonContent", LessonContentSchema);

export default LessonContent;
