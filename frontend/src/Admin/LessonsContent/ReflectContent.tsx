import React, { useState } from "react";

type ReflectContentProps = {
  reflectionPrompt: string[];
  setReflectionPrompt: (prompts: string[]) => void;
};

const ReflectContent: React.FC<ReflectContentProps> = ({
  reflectionPrompt,
  setReflectionPrompt,
}) => {
  const [newPrompt, setNewPrompt] = useState("");

  const handleAddPrompt = () => {
    const trimmed = newPrompt.trim();
    if (!trimmed) return;

    // Ensure existing prompts is an array
    const currentPrompts = Array.isArray(reflectionPrompt) ? reflectionPrompt : [];

    setReflectionPrompt([...currentPrompts, trimmed]);
    setNewPrompt("");
  };

  const handleDelete = (indexToRemove: number) => {
    const updated = reflectionPrompt.filter((_, i) => i !== indexToRemove);
    setReflectionPrompt(updated);
  };

  return (
    <div className="space-y-3 bg-white p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-2">💭 Reflect Content</h3>

      <ul className="list-decimal list-inside space-y-1 text-purple-900">
        {(Array.isArray(reflectionPrompt) ? reflectionPrompt : []).map((prompt, index) => (
          <li key={index} className="flex justify-between items-center">
            <span>{prompt}</span>
            <button
              onClick={() => handleDelete(index)}
              className="text-red-600 text-xs hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <input
          type="text"
          value={newPrompt}
          onChange={(e) => setNewPrompt(e.target.value)}
          placeholder="e.g., What did you find interesting today?"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleAddPrompt}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Question
        </button>
      </div>
    </div>
  );
};

export default ReflectContent;
