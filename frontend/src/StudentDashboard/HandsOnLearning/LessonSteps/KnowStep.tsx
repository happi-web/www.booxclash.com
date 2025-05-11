
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
}) => (
  <div className="w-full h-full flex flex-col flex-1 overflow-auto p-4">
    <button onClick={onBack} className="text-blue-500 underline text-sm absolute top-4 left-4 z-10">
      ← Back to Start
    </button>
    <button
      onClick={onNext}
      className="max-w-xs w-auto px-4 py-2 bg-orange-600 hover:bg-purple-700 rounded text-purple-100 font-bold fixed top-[20%] right-4 z-20"
    >
      Complete → Watch
    </button>
    <h2 className="text-xl font-semibold mt-16 mb-4 text-white">{topic} - Concept</h2>

    <div className="space-y-6 mb-20">
      {knowQuestions.map((q, idx) => (
        <div key={q.id} className="bg-white rounded shadow p-4 text-purple-950">
          <p className="font-semibold mb-2">
            {idx + 1}. {q.prompt}
          </p>
          {q.type === "multiple-choice" && q.options && (
            <ul className="list-disc list-inside">
              {q.options.map((option, i) => (
                <li key={i}>{option}</li>
              ))}
            </ul>
          )}
          {q.type === "visual" && q.image && (
            <img src={q.image} alt="Visual prompt" className="my-2 rounded max-h-64 object-contain" />
          )}
          {q.explanation && (
            <div className="mt-2 p-2 border-l-4 border-orange-400 bg-orange-50 rounded">
              <strong>Explanation:</strong> {q.explanation}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);
