import React from "react";

export const DoStep = ({
  topic,
  instructions,
  DynamicComponent,
  onNext,
  onBack,
}: {
  topic: string;
  instructions: string;
  DynamicComponent: React.ComponentType;
  onNext: () => void;
  onBack: () => void;
}) => (
  <div className="w-full h-full flex flex-col p-4 overflow-auto">
    <button onClick={onBack} className="text-blue-500 underline text-sm absolute top-4 left-4 z-10">
      ← Back to Watch
    </button>
    <h2 className="text-2xl font-bold text-white mb-2">{topic} - Practice Activity</h2>
    <p className="mb-4 text-white">{instructions}</p>
    <div className="flex-1 bg-white rounded-lg p-4 shadow mb-6">
      <DynamicComponent />
    </div>
    <button
      onClick={onNext}
       className="max-w-xs w-auto px-4 py-2 bg-orange-600 hover:bg-purple-700 rounded text-purple-100 font-bold fixed top-[20%] right-4 z-20"
    >
      Done → Reflect
    </button>
  </div>
);
