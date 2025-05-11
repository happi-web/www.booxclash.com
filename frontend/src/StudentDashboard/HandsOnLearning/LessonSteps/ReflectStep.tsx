export const ReflectStep = ({
  prompt,
  onNext,
  onBack,
}: {
  prompt?: string;
  onNext: () => void;
  onBack: () => void;
}) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-white">
    <button onClick={onBack} className="text-blue-500 underline text-sm absolute top-4 left-4">
      ← Back to DO
    </button>
    <h2 className="text-2xl font-bold mb-4">Reflect</h2>
    <p className="mb-6 max-w-xl text-center">
      {prompt || "Take a moment to think about what you learned. What stood out the most?"}
    </p>
    <button
      onClick={onNext}
      className="max-w-xs w-auto px-4 py-2 bg-orange-600 hover:bg-purple-700 rounded text-purple-100 font-bold fixed top-[20%] right-4 z-20"
    >
      Continue → Quiz
    </button>
  </div>
);
