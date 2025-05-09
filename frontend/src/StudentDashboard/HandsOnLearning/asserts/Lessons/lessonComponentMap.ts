// src/components/lessonComponentMap.ts
import NumberClassifier from "../Lessons/NumberClassifier";
import Fractions from "../Lessons/Fractions";
import NumberBases from "../Lessons/NumberBases";
// Add more components as needed

export const lessonComponentMap: Record<string, React.ComponentType> = {
  NumberClassifier,
  Fractions,
  NumberBases
  // "StringKey": ComponentReference
};
