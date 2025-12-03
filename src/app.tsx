import React, { useState, useEffect, useRef } from 'react';
import { World3D } from './components/World3D';
import { getLevel } from './data/maps';
import { findPath } from './utils/pathfinding';
import { castRays } from './utils/lidar';
import { CellType, Point } from './types';

const App: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  
  // True Map (Source of Truth)
  const [trueMap, setTrueMap] = useState(getLevel(0));
  
  // Robot Memory (Fog of War)
  const [knownGrid, setKnownGrid] = useState<CellType[][]>([]);
  
  // Robot State
  const [robotPos, setRobotPos] = useState<Point>(trueMap.start);
  const [path, setPath] = useState<Point[]>([]);
  const [lidarHits, setLidarHits] = useState<Point[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Init Memory
  useEffect(() => {
    const data = getLevel(levelIndex);
    setTrueMap(data);
    setRobotPos(data.start);
    
    // Init known grid with Unknowns, except start
    const emptyGrid = Array(data.height).fill(null).map(() => Array(data.width).fill(CellType.Unknown));
    emptyGrid[data.start.y][data.start.x] = CellType.Empty;
    setKnownGrid(emptyGrid);
    
    setPath([]);
    setIsRunning(false);
  }, [levelIndex]);

  // Simulation Loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // 1. Lidar Scan
      const { hits, discoveredWalls, discoveredEmpty } = castRays(
        robotPos, 0, trueMap.grid, trueMap.width, trueMap.height, 6
      );
      setLidarHits(hits);

      // 2. Update Memory
      setKnownGrid(prev => {
        const next = [...prev.map(row => [...row])];
        discoveredWalls.forEach(p => next[p.y][p.x] = CellType.Wall);
        discoveredEmpty.forEach(p => {
            if (next[p.y][p.x] !== CellType.Wall) next[p.y][p.x] = CellType.Empty;
        });
        return next;
      });

      // 3. Plan Path (if needed or periodically)
      // We only re-plan if we don't have a path or the next step is blocked
      let currentPath = path;
      // Simple check: always replan for dynamic response to new walls
      const newPath = findPath(robotPos, trueMap.end, knownGrid, trueMap.width, trueMap.height);
      setPath(newPath);
      
      // 4. Move Robot
      if (newPath.length > 1) {
        const nextStep = newPath[0]; // Next node (path[0] is usually current or next)
        
        // Interpolate for smooth movement could go here, for now discrete steps
        const dx = nextStep.x - robotPos.x;
        const dy = nextStep.y - robotPos.y;
        const speed = 0.2; 
        
        // Check if close enough to snap
        if (Math.abs(dx) < speed && Math.abs(dy) < speed) {
             setRobotPos(nextStep);
        } else {
             setRobotPos({
                 x: robotPos.x + Math.sign(dx) * speed,
                 y: robotPos.y + Math.sign(dy) * speed
             });
        }
      } else if (newPath.length === 0 && (Math.abs(robotPos.x - trueMap.end.x) < 0.5 && Math.abs(robotPos.y - trueMap.end.y) < 0.5)) {
          setIsRunning(false);
          alert("Target Reached!");
      }

    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, robotPos, trueMap, knownGrid]);

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="bg-gray-800 text-white p-4 flex gap-4 items-center z-10">
        <h1 className="text-xl font-bold">Lidar Nav Sim</h1>
        <button 
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? 'Pause' : 'Start Navigation'}
        </button>
        <button 
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
          onClick={() => setLevelIndex(i => i + 1)}
        >
          Next Level
        </button>
        <div className="text-sm">
            Robot: ({robotPos.x.toFixed(1)}, {robotPos.y.toFixed(1)})
        </div>
      </div>
      
      <div className="flex-1 relative">
        <World3D 
            grid={knownGrid} 
            width={trueMap.width} 
            height={trueMap.height}
            robotPos={robotPos}
            path={path}
            lidarHits={lidarHits}
            start={trueMap.start}
            end={trueMap.end}
        />
      </div>
    </div>
  );
};

export default App;
