import React from "react";

interface KnowQuestion {
  id: string;
  type: "short-answer" | "multiple-choice" | "visual";
  prompt: string;
  explanation?: string;
  options?: string[];
  correctAnswer?: string;
  suggestedAnswers?: string[];
  image?: string;
}

interface Props {
  questions: KnowQuestion[];
  setQuestions: (questions: KnowQuestion[]) => void;
}

const KnowContent: React.FC<Props> = ({ questions, setQuestions }) => {
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: crypto.randomUUID(), type: "short-answer", prompt: "" },
    ]);
  };

  const updateQuestion = (index: number, updated: Partial<KnowQuestion>) => {
    const updatedList = [...questions];
    updatedList[index] = { ...updatedList[index], ...updated };
    setQuestions(updatedList);
  };

  const removeQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Know Step Questions</h3>
      {questions.map((q, index) => (
        <div key={q.id} className="border p-3 rounded bg-gray-100 space-y-3">
          <select
            value={q.type}
            onChange={(e) =>
              updateQuestion(index, {
                type: e.target.value as KnowQuestion["type"],
              })
            }
            className="p-1 rounded border"
          >
            <option value="short-answer">Short Answer</option>
            <option value="multiple-choice">Multiple Choice</option>
            <option value="visual">Visual Prompt</option>
          </select>

          <input
            type="text"
            value={q.prompt}
            onChange={(e) => updateQuestion(index, { prompt: e.target.value })}
            placeholder="Enter the question prompt"
            className="w-full p-2 border rounded"
          />

          <textarea
            value={q.explanation || ""}
            onChange={(e) =>
              updateQuestion(index, { explanation: e.target.value })
            }
            placeholder="Explanation (optional)"
            className="w-full p-2 border rounded"
          />

          {q.type === "multiple-choice" && (
            <div className="space-y-1">
              {(q.options || []).map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...(q.options || [])];
                    newOptions[i] = e.target.value;
                    updateQuestion(index, { options: newOptions });
                  }}
                  className="w-full p-1 border rounded"
                  placeholder={`Option ${i + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  updateQuestion(index, {
                    options: [...(q.options || []), ""],
                  })
                }
                className="text-blue-600 text-sm"
              >
                + Add Option
              </button>

              <input
                type="text"
                value={q.correctAnswer || ""}
                onChange={(e) =>
                  updateQuestion(index, { correctAnswer: e.target.value })
                }
                placeholder="Correct Answer"
                className="w-full p-1 border rounded mt-2"
              />
            </div>
          )}

          {q.type === "visual" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      updateQuestion(index, {
                        image: reader.result as string,
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full"
              />
              {q.image && (
                <div className="mt-2">
                  <img
                    src={q.image}
                    alt="Uploaded visual"
                    className="max-w-full max-h-48 rounded border"
                  />
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Suggested Answers
            </label>
            {(q.suggestedAnswers || []).map((ans, i) => (
              <input
                key={i}
                type="text"
                value={ans}
                onChange={(e) => {
                  const updatedAnswers = [...(q.suggestedAnswers || [])];
                  updatedAnswers[i] = e.target.value;
                  updateQuestion(index, { suggestedAnswers: updatedAnswers });
                }}
                className="w-full p-1 border rounded mb-1"
                placeholder={`Suggested Answer ${i + 1}`}
              />
            ))}
            <button
              type="button"
              onClick={() =>
                updateQuestion(index, {
                  suggestedAnswers: [...(q.suggestedAnswers || []), ""],
                })
              }
              className="text-blue-600 text-sm"
            >
              + Add Suggested Answer
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeQuestion(index)}
            className="text-red-600 text-sm"
          >
            Remove Question
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addQuestion}
        className="px-3 py-2 bg-green-600 text-white rounded"
      >
        + Add Question
      </button>
    </div>
  );
};

export default KnowContent;
