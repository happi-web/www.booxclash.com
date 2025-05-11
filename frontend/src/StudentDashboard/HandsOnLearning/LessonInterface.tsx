import React, { useEffect, useState } from "react";
import { lessonComponentMap } from "./asserts/Lessons/lessonComponentMap";
import { StartStep } from "./LessonSteps/StartStep";
import { KnowStep } from "./LessonSteps/KnowStep";
import { WatchStep } from "./LessonSteps/WatchStep";
import { DoStep } from "./LessonSteps/DoStep";
import { ReflectStep } from "./LessonSteps/ReflectStep";
import { QuizStep } from "./LessonSteps/QuizStep";

type LessonInterfaceProps = {
  subject: string;
  level: number;
  topic: string;
  onBack: () => void;
};

type KnowQuestion = {
  id: string;
  type: "short-answer" | "multiple-choice" | "visual";
  prompt: string;
  explanation?: string;
  options?: string[];
  correctAnswer?: string;
  suggestedAnswers?: string[];
  image?: string;
};

type LessonContent = {
  id: string;
  subject: string;
  topic: string;
  level: number;
  knowQuestions: KnowQuestion[];
  doComponent?: string;
  watchContent: {
    videoLink: string;
    explanation: string;
  };
  reflectPrompt?: string;
  quizQuestions: any[]; // optionally define this further
};

const LessonInterface: React.FC<LessonInterfaceProps> = ({
  subject,
  level,
  topic,
  onBack,
}) => {
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [DynamicComponent, setDynamicComponent] = useState<React.ComponentType | null>(null);
  const [step, setStep] = useState<"START" | "KNOW" | "WATCH" | "DO" | "REFLECT" | "QUIZ">("START");
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchLessonContent = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/lesson-content/get?subject=${subject}&level=${level}&topic=${topic}`
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const data: LessonContent = await res.json();

        if (data) setLessonContent(data);
        else setError("No content found for the selected topic.");
      } catch (err) {
        console.error("Failed to fetch lesson content", err);
        setError("Failed to load content.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessonContent();
  }, [subject, level, topic]);

  useEffect(() => {
    if (lessonContent?.doComponent) {
      const Component = lessonComponentMap[lessonContent.doComponent];
      if (Component) {
        setDynamicComponent(() => Component);
      } else {
        console.warn("Component not found in map for:", lessonContent.doComponent);
        setDynamicComponent(null);
      }
    }
  }, [lessonContent]);

  if (loading) return <p className="p-4">Loading lesson content...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!lessonContent) return <p className="p-4 text-red-600">No lesson content available.</p>;

  return (
    <div className="w-full h-screen flex flex-col text-orange-400 relative">
      {step === "START" && <StartStep onNext={() => setStep("KNOW")} onBack={onBack} />}
      
      {step === "KNOW" && (
        <KnowStep 
          topic={lessonContent.topic} 
          knowQuestions={lessonContent.knowQuestions} 
          onNext={() => setStep("WATCH")} 
          onBack={() => setStep("START")} 
        />
      )}
      
      {step === "WATCH" && (
        <WatchStep
          videoLink={lessonContent.watchContent.videoLink}
          explanation={lessonContent.watchContent.explanation}
          onNext={() => setStep("DO")}
          onBack={() => setStep("KNOW")}
        />
      )}
      
      {step === "DO" && (
        <DoStep
          topic={lessonContent.topic}
          instructions={lessonContent.watchContent.explanation} // assuming same explanation applies
          DynamicComponent={DynamicComponent || (() => <div>Component not available</div>)}
          onNext={() => setStep("REFLECT")}
          onBack={() => setStep("WATCH")}
        />
      )}
      
      {step === "REFLECT" && (
        <ReflectStep
          prompt={lessonContent.reflectPrompt}
          onNext={() => setStep("QUIZ")}
          onBack={() => setStep("DO")}
        />
      )}
      
      {step === "QUIZ" && (
        <QuizStep
          topic={lessonContent.topic}
          questions={lessonContent.quizQuestions}
          onBack={() => setStep("REFLECT")}
          onFinish={onBack}
        />
      )}
    </div>
  );
};

export default LessonInterface;
