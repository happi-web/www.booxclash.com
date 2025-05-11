import React, { useState } from "react";

type QuizQuestion = {
  id: string;
  type: "multiple-choice" | "short-answer";
  question: string;
  options?: string[];
  answer: string;
};

type QuizContentProps = {
  content: any;
  setContent: (content: any) => void;
};

const QuizContent: React.FC<QuizContentProps> = ({ content, setContent }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(content?.quizQuestions || []);
  const [current, setCurrent] = useState<QuizQuestion>({
    id: crypto.randomUUID(),
    type: "multiple-choice",
    question: "",
    options: ["", "", "", ""],
    answer: "",
  });

  const handleAdd = () => {
    if (!current.question || !current.answer) {
      alert("Please complete the question and answer.");
      return;
    }

    setQuestions((prev) => {
      const updated = [...prev, current];
      setContent({ ...content, quizQuestions: updated });
      return updated;
    });

    setCurrent({
      id: crypto.randomUUID(),
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      answer: "",
    });
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold">🧪 Quiz Content</h3>

      <select
        value={current.type}
        onChange={(e) =>
          setCurrent((prev) => ({ ...prev, type: e.target.value as QuizQuestion["type"] }))
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

      {current.type === "multiple-choice" && (
        <div className="grid grid-cols-2 gap-2">
          {current.options!.map((opt, i) => (
            <input
              key={i}
              type="text"
              value={opt}
              onChange={(e) =>
                setCurrent((prev) => {
                  const newOpts = [...(prev.options || [])];
                  newOpts[i] = e.target.value;
                  return { ...prev, options: newOpts };
                })
              }
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
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        ➕ Add Question
      </button>

      {questions.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">📝 Questions:</h4>
          <ul className="space-y-1 text-sm list-disc pl-5">
            {questions.map((q, i) => (
              <li key={q.id}>
                {i + 1}. {q.question} ({q.type})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuizContent;
