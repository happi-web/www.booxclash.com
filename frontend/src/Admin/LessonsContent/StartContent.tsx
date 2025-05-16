import React, { useState } from "react";

type StartType = "text-prompt" | "multiple-choice" | "image" | "video" | "riddle";

interface StartContentProps {
  onChange: (startData: any) => void;
  initialData?: any;
}

const StartContent: React.FC<StartContentProps> = ({ onChange, initialData }) => {
  const [type, setType] = useState<StartType>(initialData?.type || "text-prompt");
  const [prompt, setPrompt] = useState(initialData?.prompt || "");
  const [options, setOptions] = useState<string[]>(initialData?.options || ["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(initialData?.correctAnswer || "");
  const [image, setImage] = useState<string | File>(initialData?.image || "");
  const [videoLink, setVideoLink] = useState(initialData?.videoLink || "");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const emitChange = (partial: any = {}) => {
    onChange({
      type,
      prompt,
      options,
      correctAnswer,
      image,
      videoLink,
      ...partial,
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
    emitChange({ options: updated });
  };

  const addOption = () => {
    const updated = [...options, ""];
    setOptions(updated);
    emitChange({ options: updated });
  };

  const handleTypeChange = (newType: StartType) => {
    setType(newType);
    emitChange({ type: newType });
  };

  return (
    <div className="border border-gray-300 p-4 mt-4 rounded-md shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Start (Spark Curiosity)</h3>

      <label className="block text-sm font-medium mb-1">Type:</label>
      <select
        value={type}
        onChange={(e) => handleTypeChange(e.target.value as StartType)}
        className="block w-full p-2 border border-gray-300 rounded-md mb-3"
      >
        <option value="text-prompt">Text Prompt</option>
        <option value="riddle">Riddle</option>
        <option value="multiple-choice">Multiple Choice</option>
        <option value="image">Image Prompt</option>
        <option value="video">Video Prompt</option>
      </select>

      {/* Shared prompt input */}
      <label className="block text-sm font-medium mb-1">Question:</label>
      <textarea
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          emitChange({ prompt: e.target.value });
        }}
        rows={3}
        className="block w-full p-2 border border-gray-300 rounded-md mb-3"
      />

      {type === "multiple-choice" && (
        <>
          <label className="block text-sm font-medium mb-1">Options:</label>
          {options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              placeholder={`Option ${idx + 1}`}
              className="block w-full p-2 mb-2 border border-gray-300 rounded-md"
            />
          ))}
          <button
            type="button"
            onClick={addOption}
            className="mb-3 text-sm text-blue-500"
          >
            + Add Option
          </button>
        </>
      )}

      {type === "image" && (
        <>
          <label className="block text-sm font-medium mb-1">Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const formData = new FormData();
              formData.append("image", file); // must match multer field name

              try {
                const res = await fetch(`${API_BASE}/api/lesson-content/upload-image`, {
                  method: "POST",
                  body: formData,
                });

                const data = await res.json();
                if (data.imageUrl) {
                  setImage(data.imageUrl);
                  emitChange({ image: data.imageUrl });
                }
              } catch (error) {
                console.error("Image upload failed", error);
              }
            }}
            className="block w-full"
          />

          {image && typeof image === "string" && (
            <img
              src={image}
              alt="Uploaded preview"
              className="mt-2 max-w-full max-h-48 rounded border"
            />
          )}
        </>
      )}

      {type === "video" && (
        <>
          <label className="block text-sm font-medium mb-1">YouTube Link:</label>
          <input
            type="text"
            value={videoLink}
            onChange={(e) => {
              setVideoLink(e.target.value);
              emitChange({ videoLink: e.target.value });
            }}
            placeholder="https://youtube.com/..."
            className="block w-full p-2 border border-gray-300 rounded-md mb-3"
          />
        </>
      )}

      <label className="block text-sm font-medium mb-1">Correct Answer:</label>
      <input
        type="text"
        value={correctAnswer}
        onChange={(e) => {
          setCorrectAnswer(e.target.value);
          emitChange({ correctAnswer: e.target.value });
        }}
        className="block w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
  );
};

export default StartContent;
