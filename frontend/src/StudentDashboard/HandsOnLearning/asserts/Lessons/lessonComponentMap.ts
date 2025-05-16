// src/components/lessonComponentMap.ts
import NumberClassifier from "../Lessons/NumberClassifier";
import Fractions from "../Lessons/Fractions";
import NumberBases from "../Lessons/NumberBases";
import Forces from "../Lessons/Forces";
import CombinedOperations from "../Lessons/CombinedOperations";
// Add more components as needed

export const lessonComponentMap: Record<string, React.ComponentType> = {
  NumberClassifier,
  Fractions,
  NumberBases,
  CombinedOperations,
  Forces
  // "StringKey": ComponentReference
};
