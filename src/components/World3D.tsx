import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Point, CellType } from '../types';

interface World3DProps {
  grid: CellType[][];
  width: number;
  height: number;
  robotPos: Point;
  path: Point[];
  lidarHits: Point[];
  start: Point;
  end: Point;
}

const Box = ({ position, color }: { position: [number, number, number], color: string }) => (
  <mesh position={position}>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

const Robot = ({ position }: { position: Point }) => (
  <mesh position={[position.x, 0.5, position.y]}>
    <cylinderGeometry args={[0.3, 0.3, 1, 32]} />
    <meshStandardMaterial color="blue" />
  </mesh>
);

const PathLine = ({ points }: { points: Point[] }) => {
  if (points.length < 2) return null;
  const geometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, 0.2, p.y)));
  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="green" linewidth={3} />
    </line>
  );
};

const LidarRays = ({ origin, hits }: { origin: Point, hits: Point[] }) => {
  return (
    <group>
      {hits.map((hit, i) => {
        const points = [new THREE.Vector3(origin.x, 0.5, origin.y), new THREE.Vector3(hit.x, 0.5, hit.y)];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial color="red" transparent opacity={0.3} />
          </line>
        );
      })}
    </group>
  );
};

export const World3D: React.FC<World3DProps> = ({ grid, width, height, robotPos, path, lidarHits, start, end }) => {
  return (
    <Canvas camera={{ position: [width / 2, 15, height + 5], fov: 60 }}>
      <OrbitControls target={[width / 2, 0, height / 2]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Stars />

      {/* Floor */}
      <mesh position={[width / 2 - 0.5, -0.1, height / 2 - 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Grid / Walls */}
      {grid.map((row, y) =>
        row.map((cell, x) => {
          if (cell === CellType.Wall) return <Box key={`${x}-${y}`} position={[x, 0.5, y]} color="#888" />;
          if (cell === CellType.Unknown) return <Box key={`${x}-${y}`} position={[x, 0.1, y]} color="#111" />; // Fog
          if (x === start.x && y === start.y) return <Box key={`${x}-${y}`} position={[x, 0.1, y]} color="lime" />;
          if (x === end.x && y === end.y) return <Box key={`${x}-${y}`} position={[x, 0.1, y]} color="red" />;
          return null; // Empty space known
        })
      )}

      <Robot position={robotPos} />
      <PathLine points={path} />
      <LidarRays origin={robotPos} hits={lidarHits} />
    </Canvas>
  );
};
