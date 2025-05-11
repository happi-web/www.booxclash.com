export const WatchStep = ({
  videoLink,
  explanation,
  onNext,
  onBack,
}: {
  videoLink: string;
  explanation: string;
  onNext: () => void;
  onBack: () => void;
}) => {
  const extractYouTubeID = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoID = extractYouTubeID(videoLink);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <button onClick={onBack} className="text-blue-500 underline text-sm absolute top-4 left-4 z-10">
        ← Back to Know
      </button>
      <h2 className="text-xl font-semibold mb-4 text-white">Watch the Video</h2>
      {videoID ? (
        <iframe
          className="w-full h-[300px] rounded mb-6"
          src={`https://www.youtube.com/embed/${videoID}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <p className="text-red-500 mb-6">Invalid YouTube link</p>
      )}
      <p className="mb-6 max-w-xl text-white text-center">{explanation}</p>
      <button
        onClick={onNext}
        className="max-w-xs w-auto px-4 py-2 bg-orange-600 hover:bg-purple-700 rounded text-purple-100 font-bold fixed top-[20%] right-4 z-20"
      >
        Proceed to DO
      </button>
    </div>
  );
};
