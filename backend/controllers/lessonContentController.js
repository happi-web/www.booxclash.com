import LessonContent from "../models/LessonContent.js";

// Save or Update Lesson Content
export const saveLessonContent = async (req, res) => {
  const {
    subject,
    topic,
    level,
    start,           // ✅ Extract new "start" section
    knowQuestions,
    doComponent,
    watchContent,
    reflectPrompt,
    quiz,
  } = req.body;

  try {
    const updated = await LessonContent.findOneAndUpdate(
      { subject, topic, level }, // ✅ match based on unique index
      {
        subject,
        topic,
        level,
        start,                   // ✅ Include in update
        knowQuestions,
        doComponent,
        watchContent,
        reflectPrompt,
        quiz,
      },
      { new: true, upsert: true } // create if not found
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: "Failed to save lesson content" });
  }
};


export const getLessonContent = async (req, res) => {
  try {
    const { subject, topic, level } = req.query;

    if (!subject || !topic || !level) {
      return res.status(400).json({ error: 'Missing required query parameters: subject, topic, and level are all required.' });
    }

    const lesson = await LessonContent.findOne({
      subject: subject.toString(),
      topic: topic.toString(),
      level: Number(level),
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found with the provided subject, topic, and level.' });
    }

    res.status(200).json(lesson);
  } catch (error) {
    console.error('Error fetching lesson content:', error);
    res.status(500).json({ error: 'Server error while fetching lesson content.' });
  }
};


// Get all lessons
export const getAllLessonContent = async (req, res) => {
  try {
    const all = await LessonContent.find();
    res.status(200).json(all);
  } catch (err) {
    console.error("Get all error:", err);
    res.status(500).json({ error: "Failed to fetch lesson contents" });
  }
};

// Delete a lesson by subject + topic + level
export const deleteLessonContent = async (req, res) => {
  const { subject, topic, level } = req.query;
  try {
    const deleted = await LessonContent.findOneAndDelete({
      subject,
      topic,
      level: Number(level),
    });

    if (!deleted) return res.status(404).json({ error: "Lesson not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete lesson" });
  }
};
