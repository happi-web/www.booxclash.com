import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

type QuizQuestion = {
  id: string;
  type: "short-answer" | "multiple-choice";
  question: string;
  options?: string[];
  answer: string;
};

export const QuizStep = ({
  topic,
  questions,
  onFinish,
  onBack,
}: {
  topic: string;
  questions: QuizQuestion[];
  onFinish: () => void;
  onBack: () => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [currentInput, setCurrentInput] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});

  const correctClickSoundRef = useRef<HTMLAudioElement | null>(null);
  const incorrectClickSoundRef = useRef<HTMLAudioElement | null>(null);
  const correctFinalSoundRef = useRef<HTMLAudioElement | null>(null);
  const incorrectFinalSoundRef = useRef<HTMLAudioElement | null>(null);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    correctClickSoundRef.current = new Audio("/sounds/correct1.mp3");
    incorrectClickSoundRef.current = new Audio("/sounds/incorrect2.mp3");
    correctFinalSoundRef.current = new Audio("/sounds/correct.mp3");
    incorrectFinalSoundRef.current = new Audio("/sounds/incorrect.mp3");
  }, []);

  useEffect(() => {
    if (currentQuestion.type === "short-answer") {
      setCurrentInput(selectedAnswers[currentQuestion.id] || "");
    }
  }, [currentIndex, currentQuestion.id, currentQuestion.type]);

  const handleOptionSelect = (questionId: string, selectedAnswer: string) => {
    const isCorrect = selectedAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();

    setSelectedAnswers((prev) => ({ ...prev, [questionId]: selectedAnswer }));
    setFeedback((prev) => ({ ...prev, [questionId]: isCorrect }));

    if (isCorrect) {
      correctClickSoundRef.current?.play();
    } else {
      incorrectClickSoundRef.current?.play();
    }
  };

  const handleNext = () => {
    if (currentQuestion.type === "short-answer") {
      const userAnswer = currentInput;
      const isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();

      setSelectedAnswers((prev) => ({ ...prev, [currentQuestion.id]: userAnswer }));
      setFeedback((prev) => ({ ...prev, [currentQuestion.id]: isCorrect }));

      if (isCorrect) {
        correctClickSoundRef.current?.play();
      } else {
        incorrectClickSoundRef.current?.play();
      }
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;

    const feedbackMap: Record<string, boolean> = {};
    questions.forEach((q) => {
      const userAnswer = selectedAnswers[q.id];
      const isCorrect = userAnswer?.trim().toLowerCase() === q.answer.trim().toLowerCase();
      feedbackMap[q.id] = isCorrect;
      if (isCorrect) correctCount++;
    });

    setFeedback(feedbackMap);
    setScore(correctCount);

    if (correctCount === questions.length) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      correctFinalSoundRef.current?.play();
    } else {
      incorrectFinalSoundRef.current?.play();
    }
  };

  const handleFinish = () => {
    onFinish();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-white">
      <button onClick={onBack} className="text-blue-500 underline text-sm absolute top-4 left-4">
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-4">Quiz: {topic}</h2>

      {score === null ? (
        <>
          <p className="mb-6 max-w-xl text-center">Question {currentIndex + 1} of {questions.length}</p>

          <div className="w-full max-w-md mb-6">
            <p className="font-semibold mb-2">{currentQuestion.question}</p>

            {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
              <div className="space-y-2">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === option;
                  const isCorrect = feedback[currentQuestion.id] && isSelected;
                  const isIncorrect = feedback[currentQuestion.id] === false && isSelected;

                  return (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect(currentQuestion.id, option)}
                      className={`w-full text-left px-4 py-2 rounded border
                        ${isCorrect ? "bg-green-600 border-green-500 text-white" : ""}
                        ${isIncorrect ? "bg-red-600 border-red-500 text-white" : ""}
                        ${!isCorrect && !isIncorrect ? "bg-gray-700 border-gray-500 text-white" : ""}
                      `}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === "short-answer" && (
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="w-full p-2 mt-2 text-black bg-white rounded"
                placeholder="Your answer"
              />
            )}
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-2 bg-orange-600 hover:bg-purple-700 rounded text-white font-bold"
          >
            {currentIndex < questions.length - 1 ? "Next" : "Submit"}
          </button>
        </>
      ) : (
        <div className="w-full max-w-3xl text-white">
          <p className="text-xl font-semibold mb-6 text-center">
            You scored {score} out of {questions.length}
          </p>

          <div className="space-y-4">
            {questions.map((q) => {
              const userAnswer = selectedAnswers[q.id];
              const isCorrect = userAnswer?.trim().toLowerCase() === q.answer.trim().toLowerCase();

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded border ${
                    isCorrect ? "border-green-500 bg-green-900/40" : "border-red-500 bg-red-900/30"
                  }`}
                >
                  <p className="font-semibold">{q.question}</p>
                  <p>
                    <strong>Your answer:</strong>{" "}
                    <span className={isCorrect ? "text-green-300" : "text-red-300"}>{userAnswer || "No answer"}</span>
                  </p>
                  {!isCorrect && (
                    <p>
                      <strong>Correct answer:</strong>{" "}
                      <span className="text-green-400">{q.answer}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleFinish}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold"
            >
              Finish Lesson
            </button>
          </div>
        </div>
      )}

      {/* Audio Elements */}
      <audio ref={correctClickSoundRef} src="/sounds/correct1.mp3" preload="auto" />
      <audio ref={incorrectClickSoundRef} src="/sounds/incorrect2.mp3" preload="auto" />
      <audio ref={correctFinalSoundRef} src="/sounds/correct.mp3" preload="auto" />
      <audio ref={incorrectFinalSoundRef} src="/sounds/incorrect.mp3" preload="auto" />
    </div>
  );
};
