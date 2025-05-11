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

  useEffect(() => {
    const checkContentAvailability = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/lesson-content/get?subject=${selectedSubject}&level=${selectedLevel}&topic=`
        );
        const data = await response.json();
        setHasContent(data && data.length > 0);
      } catch (error) {
        console.error("Error fetching lesson content:", error);
        setHasContent(false);
      }
    };

    checkContentAvailability();
  }, [selectedSubject, selectedLevel]);

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
    </div>
  );
}
