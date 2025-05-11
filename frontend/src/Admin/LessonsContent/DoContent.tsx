import React from "react";

type DoContentProps = {
  componentLink: string;
  setDoComponent: (link: string) => void;
};

const DoContent: React.FC<DoContentProps> = ({ componentLink, setDoComponent }) => {
  return (
    <div className="space-y-3 bg-white p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-2">🛠️ Do Content</h3>
      <input
        type="text"
        value={componentLink}
        onChange={(e) => setDoComponent(e.target.value)}
        placeholder="e.g., /components/FractionsGame"
        className="w-full border p-2 rounded"
      />
    </div>
  );
};

export default DoContent;
