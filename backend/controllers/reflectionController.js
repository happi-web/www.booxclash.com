import Reflection from "../models/Reflection.js";

export const submitReflection = async (req, res) => {
  try {
    const { prompt, response, studentId } = req.body;

    if (!prompt || !response) {
      return res.status(400).json({ error: "Prompt and response are required" });
    }

    const reflection = new Reflection({ prompt, response, studentId });
    await reflection.save();

    res.status(201).json({ message: "Reflection saved", reflection });
  } catch (err) {
    console.error("Error saving reflection:", err);
    res.status(500).json({ error: "Server error" });
  }
};
