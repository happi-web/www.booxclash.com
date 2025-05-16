import { useState, useEffect } from "react";
import TopicsGrid from "./HandsOnLearning/TopicsGrid";
import LessonInterface from "./HandsOnLearning/LessonInterface";
import NavBar from "./HandsOnLearning/Navbar";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function HandsOnActivities() {
  const [selectedSubject, setSelectedSubject] = useState<string>("Math");
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [hasContent, setHasContent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkContentAvailability = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        // Prepare API URL based on topic selection
        const url = selectedTopic
          ? `${API_BASE}/api/lesson-content/get?subject=${selectedSubject}&level=${selectedLevel}&topic=${selectedTopic}`
          : `${API_BASE}/api/lesson-content/get?subject=${selectedSubject}&level=${selectedLevel}`;

        const response = await fetch(url);
        const data = await response.json();

        if (response.ok && data) {
          // Check if content exists based on the response
          setHasContent(data && Object.keys(data).length > 0);
        } else {
          setHasContent(false);
        }
      } catch (error) {
        console.error("Error fetching lesson content:", error);
        setError("An error occurred while fetching content.");
        setHasContent(false);
      } finally {
        setLoading(false);
      }
    };

    checkContentAvailability();
  }, [selectedSubject, selectedLevel, selectedTopic]);

  return (
    <div className="w-full h-[95vh] pb-10 bg-gradient-to-br from-black via-purple-950 to-black flex flex-col overflow-hidden">
      <div className="flex-1 overflow-hidden">
        {!selectedTopic ? (
          <>
            <NavBar
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
              hasContent={hasContent}
            />
            <TopicsGrid
              subject={selectedSubject}
              level={selectedLevel}
              onTopicSelect={(topic: string) => setSelectedTopic(topic)}
            />
          </>
        ) : (
          <LessonInterface
            subject={selectedSubject}
            level={selectedLevel}
            topic={selectedTopic}
            onBack={() => setSelectedTopic(null)}
          />
        )}
      </div>

      {/* Loading and Error States */}
      {loading && <div className="loading-indicator">Loading content...</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
