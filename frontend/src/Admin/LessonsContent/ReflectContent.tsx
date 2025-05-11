import React from "react";

type ReflectContentProps = {
  reflectionPrompt: string;
  setReflectionPrompt: (prompt: string) => void;
};

const ReflectContent: React.FC<ReflectContentProps> = ({
  reflectionPrompt,
  setReflectionPrompt,
}) => {
  return (
    <div className="space-y-3 bg-white p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-2">💭 Reflect Content</h3>
      <textarea
        value={reflectionPrompt}
        onChange={(e) => setReflectionPrompt(e.target.value)}
        placeholder="e.g., What did you find most interesting about today's topic?"
        rows={3}
        className="w-full border p-2 rounded"
      />
    </div>
  );
};

export default ReflectContent;
