import React, { useState, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

type LawType = "law1" | "law2" | "law3";

interface Scenario {
  id: number;
  description: string;
  law: LawType;
}

const initialScenarios: Scenario[] = [
  { id: 1, description: "A book remains at rest until pushed.", law: "law1" },
  { id: 2, description: "A rocket accelerates when fuel burns.", law: "law2" },
  { id: 3, description: "A swimmer pushes water backward and moves forward.", law: "law3" },
  { id: 4, description: "A ball rolls and gradually stops due to friction.", law: "law1" },
  { id: 5, description: "A heavier cart requires more force to push.", law: "law2" },
  { id: 6, description: "A balloon releases air and moves in the opposite direction.", law: "law3" },
];

const DraggableScenario: React.FC<{ scenario: Scenario }> = ({ scenario }) => {
  const [, drag] = useDrag({
    type: "SCENARIO",
    item: scenario,
  });

  return (
    <div
      ref={drag}
      className="bg-yellow-100 border px-3 py-2 rounded shadow mb-2 cursor-move"
    >
      {scenario.description}
    </div>
  );
};

const DropZone: React.FC<{
  label: string;
  lawType: LawType;
  onDrop: (scenario: Scenario, lawType: LawType) => void;
  droppedScenarios: Scenario[];
}> = ({ label, lawType, onDrop, droppedScenarios }) => {
  const [, drop] = useDrop({
    accept: "SCENARIO",
    drop: (item: Scenario) => onDrop(item, lawType),
  });

  return (
    <div
      ref={drop}
      className="bg-gray-100 border-2 border-dashed border-gray-400 p-4 rounded w-full md:w-[30%] min-h-[200px]"
    >
      <h2 className="font-bold text-lg mb-2">{label}</h2>
      {droppedScenarios.map((s) => (
        <div
          key={s.id}
          className="bg-green-100 px-2 py-1 my-1 rounded text-sm"
        >
          {s.description}
        </div>
      ))}
    </div>
  );
};

const NewtonsLaws: React.FC = () => {
  const [unassigned, setUnassigned] = useState<Scenario[]>(initialScenarios);
  const [law1Scenarios, setLaw1Scenarios] = useState<Scenario[]>([]);
  const [law2Scenarios, setLaw2Scenarios] = useState<Scenario[]>([]);
  const [law3Scenarios, setLaw3Scenarios] = useState<Scenario[]>([]);
  const [complete, setComplete] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const bgMusicRef = useRef<HTMLAudioElement>(new Audio("/sounds/bg-music.mp3"));
  const correctSoundRef = useRef<HTMLAudioElement>(new Audio("/sounds/correct.mp3"));
  const incorrectSoundRef = useRef<HTMLAudioElement>(new Audio("/sounds/incorrect.mp3"));

  const { width, height } = useWindowSize();

  const handleDrop = (item: Scenario, law: LawType) => {
    if (item.law === law) {
      if (!isMuted) correctSoundRef.current.play();
      setUnassigned((prev) => prev.filter((s) => s.id !== item.id));
      if (law === "law1") setLaw1Scenarios((prev) => [...prev, item]);
      if (law === "law2") setLaw2Scenarios((prev) => [...prev, item]);
      if (law === "law3") setLaw3Scenarios((prev) => [...prev, item]);
    } else {
      if (!isMuted) incorrectSoundRef.current.play();
    }
  };

  const restartGame = () => {
    setUnassigned(initialScenarios);
    setLaw1Scenarios([]);
    setLaw2Scenarios([]);
    setLaw3Scenarios([]);
    setComplete(false);
    if (!isMuted) {
      bgMusicRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    const totalDropped =
      law1Scenarios.length + law2Scenarios.length + law3Scenarios.length;
    if (totalDropped === initialScenarios.length) {
      setComplete(true);
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
    }
  }, [law1Scenarios, law2Scenarios, law3Scenarios]);

  useEffect(() => {
    bgMusicRef.current.volume = 0.4;
    if (isMuted) {
      bgMusicRef.current.pause();
    } else {
      bgMusicRef.current.play().catch(() => {});
    }
  }, [isMuted]);

  useEffect(() => {
    bgMusicRef.current.loop = true;
    if (!isMuted) {
      bgMusicRef.current.play().catch(() => {});
    }

    return () => {
      bgMusicRef.current.pause();
    };
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 max-w-6xl mx-auto min-h-screen relative">
        {complete && <Confetti width={width} height={height} />}
        {!complete ? (
          <>
            <h1 className="text-2xl font-bold text-center mb-4">
              Newton's Laws Drag-and-Drop
            </h1>

            <div className="text-center mb-4 flex justify-center gap-4">
              <button
                onClick={() => setIsMuted((prev) => !prev)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                {isMuted ? "Unmute Music" : "Mute Music"}
              </button>
            </div>

            <p className="text-center mb-4">
              Drag each scenario to the correct Newton's Law of motion.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {unassigned.map((scenario) => (
                <DraggableScenario key={scenario.id} scenario={scenario} />
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-6">
              <DropZone
                label="1st Law: Law of Inertia"
                lawType="law1"
                onDrop={handleDrop}
                droppedScenarios={law1Scenarios}
              />
              <DropZone
                label="2nd Law: F = ma"
                lawType="law2"
                onDrop={handleDrop}
                droppedScenarios={law2Scenarios}
              />
              <DropZone
                label="3rd Law: Action-Reaction"
                lawType="law3"
                onDrop={handleDrop}
                droppedScenarios={law3Scenarios}
              />
            </div>
          </>
        ) : (
          <div className="mt-8 p-6 bg-green-100 border border-green-400 text-green-800 rounded text-center shadow-lg text-2xl font-bold">
            🎉 Congratulations! You’ve correctly matched all the scenarios to Newton's Laws! 🚀
            <div className="mt-4">
              <button
                onClick={restartGame}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default NewtonsLaws;
