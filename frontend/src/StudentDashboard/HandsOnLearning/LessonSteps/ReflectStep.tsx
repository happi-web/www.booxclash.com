import { useState } from "react";
import confetti from "canvas-confetti";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const correctSound = new Audio("/sounds/correct.mp3");

export const ReflectStep = ({
  reflectPrompt = [],
  onNext,
  onBack,
}: {
  reflectPrompt: string[];
  onNext: () => void;
  onBack: () => void;
}) => {
  const [responses, setResponses] = useState<string[]>(Array(reflectPrompt.length).fill(""));
  const [submitted, setSubmitted] = useState<boolean[]>(Array(reflectPrompt.length).fill(false));
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const handleSubmit = async (index: number) => {
    const response = responses[index];
    if (!response.trim()) return;

    setLoadingIndex(index);

    try {
      await fetch(`${API_BASE}/api/reflection/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: reflectPrompt[index],
          response,
        }),
      });

      correctSound.play();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      const newSubmitted = [...submitted];
      newSubmitted[index] = true;
      setSubmitted(newSubmitted);
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleChange = (value: string, index: number) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const allSubmitted = submitted.every((status) => status);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-white">
      <button onClick={onBack} className="text-blue-500 underline text-sm absolute top-4 left-4">
        ← Back to DO
      </button>

      <h2 className="text-2xl font-bold mb-6">Reflect</h2>

      <div className="w-full max-w-2xl space-y-8">
        {reflectPrompt.map((prompt, index) => (
          <div key={index} className="flex flex-col">
            <p className="mb-2">{prompt}</p>

            <textarea
              value={responses[index]}
              onChange={(e) => handleChange(e.target.value, index)}
              rows={3}
              placeholder="Write your reflection here..."
              className="p-3 rounded text-black bg-white  border mb-2"
              disabled={submitted[index]}
            />

            {!submitted[index] ? (
              <button
                onClick={() => handleSubmit(index)}
                disabled={loadingIndex === index}
                className="self-start px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
              >
                {loadingIndex === index ? "Submitting..." : "Submit"}
              </button>
            ) : (
              <div className="text-green-300 font-semibold">✅ Submitted</div>
            )}
          </div>
        ))}
      </div>

      {allSubmitted && (
        <button
          onClick={onNext}
          className="mt-10 px-5 py-2 bg-orange-600 hover:bg-purple-700 rounded text-white font-bold"
        >
          Continue → Quiz
        </button>
      )}
    </div>
  );
};
