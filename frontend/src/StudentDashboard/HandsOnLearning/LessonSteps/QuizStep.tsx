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
}) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-white">
    <button onClick={onBack} className="text-blue-500 underline text-sm absolute top-4 left-4">
      ← Back to Reflect
    </button>
    <h2 className="text-2xl font-bold mb-4">Quiz: {topic}</h2>
    <p className="mb-6 max-w-xl text-center">
      {questions.length > 0
        ? "Let's test what you've learned! (You can render your quiz questions here.)"
        : "No quiz questions available."}
    </p>
    <button
      onClick={onFinish}
      className="max-w-xs w-auto px-4 py-2 bg-orange-600 hover:bg-purple-700 rounded text-purple-100 font-bold fixed top-[20%] right-4 z-20"
    >
      Finish Lesson
    </button>
  </div>
);
