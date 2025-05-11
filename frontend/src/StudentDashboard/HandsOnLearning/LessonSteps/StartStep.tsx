export const StartStep = ({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) => (
  <div className="w-full h-full flex flex-col items-center justify-center space-y-4 p-6">
    <button onClick={onBack} className="text-blue-500 underline text-sm absolute top-4 left-4">
      ← Back to topics
    </button>
    <h1 className="text-3xl font-bold text-center">Ready to Learn?</h1>
    <button
      onClick={onNext}
      className="px-6 py-3 bg-orange-700 hover:bg-purple-800 rounded-lg text-purple-200 font-semibold fixed top-[15%] right-[5%] z-20"
    >
      Start
    </button>
  </div>
);
