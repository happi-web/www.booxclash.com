import mongoose from "mongoose";

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
    id: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    level: { type: Number, required: true },

    knowQuestions: [KnowQuestionSchema],
    doComponent: { type: String },
    watchContent: WatchContentSchema,
    reflectPrompt: { type: String },

    quizQuestions: [QuizQuestionSchema], // Structured quiz
  },
  { timestamps: true }
);

const LessonContent =
  mongoose.models.LessonContent || mongoose.model("LessonContent", LessonContentSchema);

export default LessonContent;
