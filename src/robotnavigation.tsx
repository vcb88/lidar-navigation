import React, { useState, useEffect } from 'react';
import { generateMap } from './mapGenerator';
import { updateDiscoveredGrid, findPath } from './robotLogic';
import Map from './Map';
import { Point, MapConfig } from './types';

interface DebugInfo {
  pathLength?: number;
  pathIterations?: number;
  newlyDiscovered?: number;
  currentPosition?: Point;
  distanceToTarget?: number;
}

const RobotNavigation: React.FC = () => {
  // Конфигурация
  const mapConfig: MapConfig = {
    width: 800,
    height: 600,
    gridSize: 20,
    wallThickness: 20
  };
  
  // Параметры робота и лидара
  const robotSize = 20;
  const lidarRadius = 120;
  
  // Состояния
  const [robotPosition, setRobotPosition] = useState<Point>({ x: 60, y: 60 });
  const [targetPosition] = useState<Point>({ x: 700, y: 500 });
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [discoveredGrid, setDiscoveredGrid] = useState<Set<string>>(new Set());
  const [obstacleGrid, setObstacleGrid] = useState<Set<string>>(new Set());
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [plannedPath, setPlannedPath] = useState<Point[]>([]);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});
  const [mapSeed, setMapSeed] = useState<number>(1);

  // Инициализация и обновление карты
  useEffect(() => {
    const obstacles = generateMap(mapConfig);
    setObstacleGrid(obstacles);
    setDiscoveredGrid(new Set());
    setCurrentPath([]);
    setPlannedPath([]);
    setRobotPosition({ x: 60, y: 60 });
    setIsSimulating(false);
    console.log('Map regenerated with seed:', mapSeed);
  }, [mapSeed]);

  // Симуляция движения робота
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Обновляем обнаруженные препятствия
      const { newDiscovered, newlyDiscovered } = updateDiscoveredGrid(
        robotPosition,
        lidarRadius,
        obstacleGrid,
        discoveredGrid,
        mapConfig.gridSize,
        mapConfig.width,
        mapConfig.height
      );
      setDiscoveredGrid(newDiscovered);

      // Находим и обновляем путь
      const { path, iterations } = findPath(
        robotPosition,
        targetPosition,
        discoveredGrid,
        mapConfig.gridSize,
        robotSize,
        mapConfig.width,
        mapConfig.height
      );
      setPlannedPath(path);

      // Двигаем робота к следующей точке пути
      if (path.length > 1) {
        const nextPoint = path[1];
        setRobotPosition(nextPoint);
        setCurrentPath(oldPath => [...oldPath, nextPoint]);

        setDebugInfo(prev => ({
          ...prev,
          pathLength: path.length,
          pathIterations: iterations,
          newlyDiscovered,
          currentPosition: nextPoint,
          distanceToTarget: Math.sqrt(
            Math.pow(targetPosition.x - nextPoint.x, 2) +
            Math.pow(targetPosition.y - nextPoint.y, 2)
          )
        }));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isSimulating, robotPosition, targetPosition, discoveredGrid, obstacleGrid, mapConfig]);

  const handleSimulationToggle = () => {
    setIsSimulating(prev => !prev);
  };

  const handleMapRegeneration = () => {
    if (!isSimulating) {
      setMapSeed(prev => prev + 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-4 space-y-2">
        <div className="space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={handleSimulationToggle}
          >
            {isSimulating ? 'Пауза' : 'Старт'}
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            onClick={handleMapRegeneration}
            disabled={isSimulating}
          >
            Сгенерировать новую карту
          </button>
        </div>
        <div className="text-sm text-gray-600">
          <p>Состояние симуляции: {isSimulating ? 'Запущена' : 'Остановлена'}</p>
          <p>Обнаружено препятствий: {discoveredGrid.size}</p>
          <p>Длина планируемого пути: {plannedPath.length}</p>
          <p>Расстояние до цели: {debugInfo.distanceToTarget?.toFixed(1) || 'N/A'}</p>
        </div>
      </div>
      
      <Map
        width={mapConfig.width}
        height={mapConfig.height}
        robotPosition={robotPosition}
        targetPosition={targetPosition}
        lidarRadius={lidarRadius}
        obstacleGrid={obstacleGrid}
        discoveredGrid={discoveredGrid}
        plannedPath={plannedPath}
        currentPath={currentPath}
        robotSize={robotSize}
        gridSize={mapConfig.gridSize}
      />
    </div>
  );
};

export default RobotNavigation;