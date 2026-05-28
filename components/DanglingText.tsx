import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { BoxLetter } from "@/components/BoxLetter";
import * as THREE from "three";

interface DanglingTextProps {
  text: string;
  position: [number, number, number];
  parentRotationRef: React.RefObject<THREE.Group | null>;
  color: string;
  scale?: number;
  isUserInteracting?: boolean;
}

// Animation configuration constants
const ANIMATION_CONFIG = {
  SWING_THRESHOLD: 0.003,
  SWING_TARGET_THRESHOLD: 0.02,
  SWAY_INFLUENCE: 0.1,
  AMPLITUDE: {
    X: 0.12,
    Y: 0.08,
    Z: 0.06,
  },
  SPEED_RANGE: {
    X: { min: 0.3, max: 0.6 },
    Y: { min: 0.6, max: 1.0 },
    Z: { min: 0.2, max: 0.4 },
  },
} as const;

export const DanglingText = ({
  text,
  position,
  parentRotationRef,
  color,
  scale = 1 / 3,
  isUserInteracting = false,
}: DanglingTextProps) => {
  const group = useRef<THREE.Group>(null);

  // All animation state lives in refs — no React re-renders during animation.
  const swingRef = useRef(0);
  const swingVelocity = useRef(0);
  const lastParentRot = useRef(0);

  // Random seeds for natural movement — stable across renders.
  const [randomSeed] = useState(() => Math.random() * 1000);
  const [floatSeeds] = useState(() => ({
    x: Math.random() * 1000,
    y: Math.random() * 1000 + 300,
    z: Math.random() * 1000 + 600,
    speedX:
      ANIMATION_CONFIG.SPEED_RANGE.X.min +
      Math.random() *
        (ANIMATION_CONFIG.SPEED_RANGE.X.max -
          ANIMATION_CONFIG.SPEED_RANGE.X.min),
    speedY:
      ANIMATION_CONFIG.SPEED_RANGE.Y.min +
      Math.random() *
        (ANIMATION_CONFIG.SPEED_RANGE.Y.max -
          ANIMATION_CONFIG.SPEED_RANGE.Y.min),
    speedZ:
      ANIMATION_CONFIG.SPEED_RANGE.Z.min +
      Math.random() *
        (ANIMATION_CONFIG.SPEED_RANGE.Z.max -
          ANIMATION_CONFIG.SPEED_RANGE.Z.min),
  }));

  useFrame((state, delta) => {
    if (isUserInteracting || !group.current || !parentRotationRef.current)
      return;

    const currentTime = state.clock.elapsedTime;
    const parentY = parentRotationRef.current.rotation.y;

    // --- Float animation: mutate position directly, no setState ---
    group.current.position.set(
      position[0] +
        Math.sin(currentTime * floatSeeds.speedX + floatSeeds.x) *
          ANIMATION_CONFIG.AMPLITUDE.X,
      position[1] +
        Math.sin(currentTime * floatSeeds.speedY + floatSeeds.y) *
          ANIMATION_CONFIG.AMPLITUDE.Y,
      position[2] +
        Math.sin(currentTime * floatSeeds.speedZ + floatSeeds.z) *
          ANIMATION_CONFIG.AMPLITUDE.Z,
    );

    // --- Swing physics: mutate rotation.z directly, no setState ---
    const stiffness = 4;
    const damping = 3;

    const force = stiffness * (parentY - swingRef.current);
    swingVelocity.current += force * delta;
    swingVelocity.current *= Math.exp(-damping * delta);

    const sway = Math.sin(currentTime * 0.5 + randomSeed) * 0.01;
    const swingChange =
      swingVelocity.current * delta +
      sway * delta * ANIMATION_CONFIG.SWAY_INFLUENCE;

    if (
      Math.abs(swingChange) > ANIMATION_CONFIG.SWING_THRESHOLD ||
      Math.abs(parentY - swingRef.current) >
        ANIMATION_CONFIG.SWING_TARGET_THRESHOLD
    ) {
      swingRef.current += swingChange;
      group.current.rotation.z = swingRef.current;
    }

    lastParentRot.current = parentY;
  });

  // Split text into letters and center — memoized for performance.
  const { letters, totalWidth, letterSpacing } = useMemo(() => {
    const letterArray = text.toUpperCase().split("");
    const spacing = 0.95;
    const width = (letterArray.length - 1) * spacing;
    return { letters: letterArray, totalWidth: width, letterSpacing: spacing };
  }, [text]);

  return (
    <group ref={group} position={isUserInteracting ? position : undefined}>
      {letters.map((letter, idx) =>
        letter !== " " ? (
          <BoxLetter
            key={idx}
            letter={letter}
            position={[idx * letterSpacing - totalWidth / 2, 0, 0]}
            scale={scale}
            color={color}
          />
        ) : null,
      )}
    </group>
  );
};
