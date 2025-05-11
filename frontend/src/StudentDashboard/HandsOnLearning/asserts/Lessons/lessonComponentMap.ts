// src/components/lessonComponentMap.ts
import NumberClassifier from "../Lessons/NumberClassifier";
import Fractions from "../Lessons/Fractions";
import NumberBases from "../Lessons/NumberBases";
import Forces from "../Lessons/Forces";
// Add more components as needed

export const lessonComponentMap: Record<string, React.ComponentType> = {
  NumberClassifier,
  Fractions,
  NumberBases,
  Forces
  // "StringKey": ComponentReference
};
