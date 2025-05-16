import React, { useState } from "react";

type QuizQuestion = {
  id: string;
  type: "multiple-choice" | "short-answer";
  question: string;
  options?: string[];
  answer: string;
};

type QuizContentProps = {
  questions: QuizQuestion[];
  setQuestions: (questions: QuizQuestion[]) => void;
};

const QuizContent: React.FC<QuizContentProps> = ({
  questions = [], // Default to empty array for safety
  setQuestions,
}) => {
  const [current, setCurrent] = useState<QuizQuestion>({
    id: crypto.randomUUID(),
    type: "multiple-choice",
    question: "",
    options: ["", "", "", ""],
    answer: "",
  });

  const handleAdd = () => {
    const trimmedQuestion = current.question.trim();
    const trimmedAnswer = current.answer.trim();

    if (!trimmedQuestion || !trimmedAnswer) {
      alert("Please complete the question and answer.");
      return;
    }

    if (
      current.type === "multiple-choice" &&
      (!current.options || current.options.some((opt) => !opt.trim()))
    ) {
      alert("All options must be filled for multiple-choice questions.");
      return;
    }

    setQuestions([...questions, { ...current, question: trimmedQuestion, answer: trimmedAnswer }]);

    setCurrent({
      id: crypto.randomUUID(),
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      answer: "",
    });
  };

  const handleDelete = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleOptionChange = (index: number, value: string) => {
    setCurrent((prev) => {
      const newOpts = [...(prev.options ?? ["", "", "", ""])];
      newOpts[index] = value;
      return { ...prev, options: newOpts };
    });
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold">🧪 Quiz Content</h3>

      <select
        value={current.type}
        onChange={(e) =>
          setCurrent((prev) => ({
            ...prev,
            type: e.target.value as QuizQuestion["type"],
            options: e.target.value === "multiple-choice" ? ["", "", "", ""] : undefined,
          }))
        }
        className="border p-2 rounded w-full"
      >
        <option value="multiple-choice">Multiple Choice</option>
        <option value="short-answer">One-word Answer</option>
      </select>

      <input
        type="text"
        value={current.question}
        onChange={(e) => setCurrent({ ...current, question: e.target.value })}
        placeholder="Enter your question"
        className="w-full border p-2 rounded"
      />

      {current.type === "multiple-choice" && current.options && (
        <div className="grid grid-cols-2 gap-2">
          {current.options.map((opt, i) => (
            <input
              key={i}
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(i, e.target.value)}
              placeholder={`Option ${i + 1}`}
              className="border p-2 rounded"
            />
          ))}
        </div>
      )}

      <input
        type="text"
        value={current.answer}
        onChange={(e) => setCurrent({ ...current, answer: e.target.value })}
        placeholder="Correct answer"
        className="w-full border p-2 rounded"
      />

      <button
        type="button"
        onClick={handleAdd}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        ➕ Add Question
      </button>

      {questions.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">📝 Questions:</h4>
          <ul className="space-y-2">
            {questions.map((q, i) => (
              <li key={q.id} className="flex justify-between items-start text-sm">
                <span>
                  {i + 1}. {q.question} <em>({q.type})</em>
                </span>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="text-red-600 hover:underline text-xs"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuizContent;
