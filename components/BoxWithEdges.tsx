import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

interface BoxWithEdgesProps {
  position: [number, number, number];
  color?: string;
}

// Module-level shared geometries — created once for the lifetime of the app.
const _boxGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const _edgesGeo = new THREE.EdgesGeometry(_boxGeo);
const _edgesMat = new THREE.LineBasicMaterial({
  color: "#214dbd",
  linewidth: 2,
});

// Per-color material cache — instances with the same color share one material object.
const _faceMaterialCache = new Map<string, THREE.MeshPhysicalMaterial>();

function getFaceMaterial(color: string): THREE.MeshPhysicalMaterial {
  if (!_faceMaterialCache.has(color)) {
    _faceMaterialCache.set(
      color,
      new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.9,
        transmission: 0.5,
        clearcoat: 1,
      }),
    );
  }
  return _faceMaterialCache.get(color)!;
}

export const BoxWithEdges = ({
  position,
  color = "#0070f3",
}: BoxWithEdgesProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Attach shared geometries and materials imperatively to avoid R3F JSX
  // prop type conflicts introduced by three-mesh-bvh augmentation.
  useLayoutEffect(() => {
    if (meshRef.current) {
      meshRef.current.geometry = _boxGeo;
      meshRef.current.material = getFaceMaterial(color);
    }
    if (linesRef.current) {
      linesRef.current.geometry = _edgesGeo;
      linesRef.current.material = _edgesMat;
    }
  }, [color]);

  return (
    <group position={position}>
      <mesh ref={meshRef} />
      <lineSegments ref={linesRef} />
    </group>
  );
};
