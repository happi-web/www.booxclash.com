import { useState } from "react";
import confetti from "canvas-confetti";

const correctSound = new Audio("/sounds/correct.mp3");
const incorrectSound = new Audio("/sounds/incorrect.mp3");

type KnowQuestion = {
  id: string;
  type: "short-answer" | "multiple-choice" | "visual";
  prompt: string;
  explanation?: string;
  options?: string[];
  correctAnswer?: string;
  suggestedAnswers?: string[];
  image?: string;
};

export const KnowStep = ({
  topic,
  knowQuestions,
  onNext,
  onBack,
}: {
  topic: string;
  knowQuestions: KnowQuestion[];
  onNext: () => void;
  onBack: () => void;
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const handleChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const playSound = (type: "correct" | "incorrect") => {
    switch (type) {
      case "correct":
        correctSound.play();
        break;
      case "incorrect":
        incorrectSound.play();
        break;
    }
  };

const handleSubmit = (q: KnowQuestion) => {
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  setSubmitted((prev) => ({ ...prev, [q.id]: true }));

  const userAnswer = answers[q.id]?.trim().toLowerCase();
  const correct = q.correctAnswer?.trim().toLowerCase();
  const suggestions = q.suggestedAnswers?.map((s) => s.trim().toLowerCase()) || [];

  if (q.type === "multiple-choice" && correct) {
    if (userAnswer === correct) {
      playSound("correct");
    } else {
      playSound("incorrect");
    }
  } else {
    // short-answer or visual
    if (correct && userAnswer === correct) {
      playSound("correct");
    } else if (suggestions.includes(userAnswer || "")) {
      playSound("correct");
    } else {
      playSound("incorrect");
    }
  }
};


  const handleRetry = (id: string) => {
    setSubmitted((prev) => ({ ...prev, [id]: false }));
    setAnswers((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <div className="w-full h-full flex flex-col overflow-auto p-4">
      <button
        onClick={onBack}
        className="text-blue-500 underline text-sm absolute top-4 left-4 z-10"
      >
        ← Back to Start
      </button>
      <button
        onClick={onNext}
        className="max-w-xs w-auto px-4 py-2 bg-orange-600 hover:bg-purple-700 rounded text-purple-100 font-bold fixed top-[20%] right-4 z-20"
      >
        Complete → Watch
      </button>

      <h2 className="text-xl font-semibold mt-16 mb-4 text-white">{topic} - Concept</h2>

      <div className="space-y-6 mb-24">
        {knowQuestions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded shadow p-4 text-purple-950">
              {q.explanation && (
                <div className="mb-3 p-2 border-l-4 border-orange-400 bg-orange-50 rounded text-sm">
                  <strong>Concept:</strong>
                  <div className="mt-1">
                    {q.explanation.split("\n").map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            <p className="font-semibold mb-2">
              {idx + 1}. {q.prompt}
            </p>

            {q.type === "multiple-choice" && q.options && (
              <div className="mb-3 space-y-2">
                {q.options.map((option, i) => {
                  const label = String.fromCharCode(65 + i); // A, B, C, D...
                  return (
                    <label key={i} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`mc-${q.id}`}
                        value={option}
                        checked={answers[q.id] === option}
                        onChange={() => handleChange(q.id, option)}
                        disabled={submitted[q.id]}
                      />
                      <span>
                        <strong>{label}.</strong> {option}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {q.type === "visual" && q.image && (
              <img
                src={q.image}
                alt="Visual prompt"
                className="my-2 rounded max-h-64 object-contain"
              />
            )}

            {q.type !== "multiple-choice" && (
              <input
                type="text"
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
                placeholder="Your answer..."
                className="w-full p-2 border rounded mb-2"
                disabled={submitted[q.id]}
              />
            )}

            {!submitted[q.id] ? (
              <button
                onClick={() => handleSubmit(q)}
                className="px-4 py-1 bg-blue-600 text-white rounded"
              >
                Submit
              </button>
            ) : (
              <div className="mt-2 space-y-2">
                {q.type === "multiple-choice" && (
                  <div
                    className={`p-2 rounded font-medium ${
                      answers[q.id]?.trim().toLowerCase() ===
                      q.correctAnswer?.trim().toLowerCase()
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {answers[q.id]?.trim().toLowerCase() ===
                    q.correctAnswer?.trim().toLowerCase()
                      ? "✅ Correct!"
                      : "❌ Incorrect."}
                  </div>
                )}

                <div className="text-sm text-gray-800">
                  {q.correctAnswer && (
                    <p>
                      <strong>Correct Answer:</strong> {q.correctAnswer}
                    </p>
                  )}

                  {q.suggestedAnswers && q.suggestedAnswers.length > 0 && (
                    <div>
                      <p className="font-medium">Suggested Answers:</p>
                      <ul className="list-disc list-inside">
                        {q.suggestedAnswers.map((ans, i) => (
                          <li key={i}>{ans}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleRetry(q.id)}
                  className="mt-2 text-sm text-blue-600 underline"
                >
                  Retry this question
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
