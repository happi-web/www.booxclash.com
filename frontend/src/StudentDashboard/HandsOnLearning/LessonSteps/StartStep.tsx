import { useState } from "react";
import confetti from "canvas-confetti";

const correctSound = new Audio("/sounds/smart.mp3");
const incorrectSound = new Audio("/sounds/learn.mp3");

export const StartStep = ({
  type,
  prompt,
  options = [],
  image,
  videoLink,
  correctAnswer = "",
  onBack,
  onSubmit,
}: {
  type: string;
  prompt?: string;
  options?: string[];
  image?: string;
  videoLink?: string;
  correctAnswer?: string;
  onBack: () => void;
  onSubmit: () => void;
}) => {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const extractYouTubeID = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoID = videoLink ? extractYouTubeID(videoLink) : null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleSubmit = () => {
    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedCorrect = correctAnswer.trim().toLowerCase();

    if (normalizedAnswer === normalizedCorrect) {
      correctSound.play();
      triggerConfetti();
      setFeedback(null);
      setIsSubmitted(true);
      setTimeout(onSubmit, 1500);
    } else {
      incorrectSound.play();
      setFeedback(`Incorrect. The correct answer is: "${correctAnswer}"`);
    }
  };

  const handleOptionClick = (option: string) => {
    setAnswer(option);
    if (option.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
      correctSound.play();
      triggerConfetti();
      setFeedback(null);
      setIsSubmitted(true);
      setTimeout(onSubmit, 1500);
    } else {
      incorrectSound.play();
      setFeedback(`Incorrect. The correct answer is: "${correctAnswer}"`);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 relative text-white">
      <button onClick={onBack} className="text-blue-400 underline text-sm absolute top-4 left-4 z-10">
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-4 capitalize">
        {type === "riddle" ? "Solve the Riddle" : "Let's Have a Snack!"}
      </h2>

      <p className="text-lg text-center mb-4 max-w-2xl whitespace-pre-line">{prompt}</p>

      {type === "video" && videoID && (
        <iframe
          className="w-full h-[300px] rounded mb-6"
          src={`https://www.youtube.com/embed/${videoID}`}
          title="Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
      {type === "image" && image && (
        <img
          src={`http://localhost:5000${image}`}
          alt="Prompt Visual"
          className="w-64 h-auto mb-6 rounded border"
        />
      )}

      {type === "multiple-choice" ? (
        <div className="flex flex-col gap-3 mt-4">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(opt)}
              className={`px-4 py-2 rounded ${
                answer === opt ? "bg-green-600" : "bg-purple-600"
              } hover:bg-purple-700 text-white font-medium`}
              disabled={isSubmitted}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 mt-4">
          <input
            type="text"
            placeholder="Your answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="px-4 py-2 rounded border border-gray-300 text-black w-64"
            disabled={isSubmitted}
          />
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold"
            disabled={isSubmitted}
          >
            Submit
          </button>
        </div>
      )}

      {feedback && (
        <p className="mt-4 text-red-400 font-medium text-center">{feedback}</p>
      )}
    </div>
  );
};
