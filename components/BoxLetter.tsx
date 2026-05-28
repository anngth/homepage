import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { BoxWithEdges } from "@/components/BoxWithEdges";
import * as THREE from "three";

interface BoxLetterProps {
  letter: string;
  position: [number, number, number];
  scale?: number;
  color: string;
  enableRandomMovement?: boolean;
  isUserInteracting?: boolean;
}

// Module-level shape table — defined once, never recreated on render.
const LETTER_SHAPES: Record<string, number[][]> = {
  H: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  E: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  R: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  X: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  O: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  B: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  D: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  V: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  P: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  L: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  F: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  W: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  A: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  C: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  G: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  U: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  Y: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  J: [
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
  ],
  K: [
    [1, 0, 0, 1],
    [1, 0, 1, 0],
    [1, 1, 0, 0],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  Q: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [0, 1, 1, 1, 1],
  ],
  Z: [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
};

export const BoxLetter = ({
  letter,
  position,
  scale = 1,
  color,
  enableRandomMovement = false,
  isUserInteracting = false,
}: BoxLetterProps) => {
  const group = useRef<THREE.Group>(null);

  // Random movement state - simplified
  const lastUpdateTime = useRef(0);
  const [randomSeed] = useState(() => ({
    x: Math.random() * 1000,
    y: Math.random() * 1000 + 500,
    z: Math.random() * 1000 + 1000,
    speedX: 0.4 + Math.random() * 0.3, // Moderate: 0.4 - 0.7
    speedY: 0.5 + Math.random() * 0.4, // Moderate: 0.5 - 0.9
    speedZ: 0.3 + Math.random() * 0.3, // Moderate: 0.3 - 0.6
  }));

  useFrame((state) => {
    // Completely disable animation when user is interacting
    if (isUserInteracting) return;

    if (enableRandomMovement && group.current) {
      const time = state.clock.elapsedTime;

      // Throttle updates to reduce lag - update every 16ms (~60fps)
      if (time - lastUpdateTime.current < 0.016) return;
      lastUpdateTime.current = time;

      // Mutate position directly — no Vector3 allocation per frame.
      group.current.position.set(
        position[0] + Math.sin(time * randomSeed.speedX + randomSeed.x) * 0.1,
        position[1] + Math.sin(time * randomSeed.speedY + randomSeed.y) * 0.08,
        position[2] + Math.sin(time * randomSeed.speedZ + randomSeed.z) * 0.06,
      );
    }
  });

  const letterShape = LETTER_SHAPES[letter] ?? LETTER_SHAPES["H"];

  return (
    <group ref={group} position={position} scale={[scale, scale, scale]}>
      {letterShape.map((row, i) =>
        row.map((cell, j) => {
          if (cell) {
            let xOffset =
              j * 0.5 -
              (letter === "T" || letter === "I"
                ? 1
                : letter === "E" || letter === "L"
                  ? 0.5
                  : letter === "R" ||
                      letter === "F" ||
                      letter === "J" ||
                      letter === "K"
                    ? 1.5
                    : letter === "X" ||
                        letter === "N" ||
                        letter === "H" ||
                        letter === "M" ||
                        letter === "S" ||
                        letter === "W" ||
                        letter === "A" ||
                        letter === "C" ||
                        letter === "G" ||
                        letter === "U" ||
                        letter === "Y" ||
                        letter === "O" ||
                        letter === "Q" ||
                        letter === "Z"
                      ? 1
                      : 0.75);

            if (
              letter === "H" ||
              letter === "N" ||
              letter === "M" ||
              letter === "S" ||
              letter === "W" ||
              letter === "A" ||
              letter === "C" ||
              letter === "G" ||
              letter === "U" ||
              letter === "Y" ||
              letter === "O" ||
              letter === "Q" ||
              letter === "Z"
            ) {
              if (j === 0) {
                xOffset = -1;
              } else if (j === 1) {
                xOffset = -0.5;
              } else if (j === 2) {
                xOffset = 0;
              } else if (j === 3) {
                xOffset = 0.5;
              } else if (j === 4) {
                xOffset = 1;
              }
            }

            if (letter === "X") {
              if (j === 0) {
                xOffset = -1;
              } else if (j === 1) {
                xOffset = -0.75;
              } else if (j === 2) {
                xOffset = -0.25;
              } else if (j === 3) {
                xOffset = 0.25;
              } else if (j === 4) {
                xOffset = 0.5;
              }
            }

            if (
              letter === "R" ||
              letter === "F" ||
              letter === "J" ||
              letter === "K"
            ) {
              if (j === 0) {
                xOffset = -1;
              } else if (j === 1) {
                xOffset = -0.5;
              } else if (j === 2) {
                xOffset = 0;
              } else if (j === 3) {
                xOffset = 0.5;
              }
            }

            return (
              <BoxWithEdges
                key={`${i}-${j}`}
                position={[xOffset, (4 - i) * 0.5 - 1, 0]}
                color={color}
              />
            );
          }
          return null;
        }),
      )}
    </group>
  );
};
