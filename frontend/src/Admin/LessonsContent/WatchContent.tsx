import React from "react";

type WatchContentProps = {
  videoLink: string;
  explanation: string;
  setWatchContent: (data: { videoLink: string; explanation: string }) => void;
};

const WatchContent: React.FC<WatchContentProps> = ({
  videoLink,
  explanation,
  setWatchContent,
}) => {
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWatchContent({ videoLink: e.target.value, explanation });
  };

  const handleExplanationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWatchContent({ videoLink, explanation: e.target.value });
  };

  return (
    <div className="bg-white p-4 rounded shadow-md space-y-3">
      <h3 className="text-lg font-semibold mb-2">📺 Watch Content</h3>
      <div>
        <label className="block text-sm font-medium">YouTube Link</label>
        <input
          type="url"
          value={videoLink}
          onChange={handleVideoChange}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full border p-2 rounded mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Brief Explanation</label>
        <textarea
          value={explanation}
          onChange={handleExplanationChange}
          rows={3}
          className="w-full border p-2 rounded mt-1"
          placeholder="Why is this video important?"
        />
      </div>
    </div>
  );
};

export default WatchContent;
