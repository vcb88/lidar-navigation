// mapGenerator.ts
import { MapConfig, Point } from './types';

export const addRectObstacle = (
  obstacles: Set<string>,
  x: number,
  y: number,
  width: number,
  height: number,
  gridSize: number
): void => {
  for (let i = Math.floor(x / gridSize); i < Math.ceil((x + width) / gridSize); i++) {
    for (let j = Math.floor(y / gridSize); j < Math.ceil((y + height) / gridSize); j++) {
      obstacles.add(`${i},${j}`);
    }
  }
};

export const removeRectObstacle = (
  obstacles: Set<string>,
  x: number,
  y: number,
  width: number,
  height: number,
  gridSize: number
): void => {
  for (let i = Math.floor(x / gridSize); i < Math.ceil((x + width) / gridSize); i++) {
    for (let j = Math.floor(y / gridSize); j < Math.ceil((y + height) / gridSize); j++) {
      obstacles.delete(`${i},${j}`);
    }
  }
};

interface Wall {
  x?: number;
  y?: number;
}

export const generateMap = (config: MapConfig): Set<string> => {
  const { width, height, gridSize, wallThickness } = config;
  const obstacles = new Set<string>();
  
  // Random number generator
  const random = (min: number, max: number): number => 
    Math.floor(Math.random() * (max - min) + min);
  
  // Внешние стены
  addRectObstacle(obstacles, 0, 0, width, wallThickness, gridSize); // Верхняя
  addRectObstacle(obstacles, 0, height - wallThickness, width, wallThickness, gridSize); // Нижняя
  addRectObstacle(obstacles, 0, 0, wallThickness, height, gridSize); // Левая
  addRectObstacle(obstacles, width - wallThickness, 0, wallThickness, height, gridSize); // Правая

  // Вертикальные перегородки
  const verticalWalls: Wall[] = [
    { x: width * 0.25 },
    { x: width * 0.5 },
    { x: width * 0.75 }
  ];

  verticalWalls.forEach(wall => {
    if (wall.x === undefined) return;
    const wallX = wall.x;
    const heightStart = random(wallThickness * 2, height * 0.4);
    const heightEnd = random(height * 0.6, height - wallThickness * 2);
    addRectObstacle(obstacles, wallX, heightStart, wallThickness, heightEnd - heightStart, gridSize);
  });

  // Горизонтальные перегородки
  const horizontalWalls: Wall[] = [
    { y: height * 0.33 },
    { y: height * 0.66 }
  ];

  horizontalWalls.forEach(wall => {
    if (wall.y === undefined) return;
    const wallY = wall.y;
    const widthStart = random(wallThickness * 2, width * 0.4);
    const widthEnd = random(width * 0.6, width - wallThickness * 2);
    addRectObstacle(obstacles, widthStart, wallY, widthEnd - widthStart, wallThickness, gridSize);
  });

  // Создаем проходы
  verticalWalls.forEach(wall => {
    if (wall.x === undefined) return;
    const passageY = random(wallThickness * 2, height - wallThickness * 3);
    removeRectObstacle(
      obstacles, 
      wall.x - wallThickness/2, 
      passageY, 
      wallThickness * 2, 
      wallThickness * 3, 
      gridSize
    );
  });

  horizontalWalls.forEach(wall => {
    if (wall.y === undefined) return;
    const passageX = random(wallThickness * 2, width - wallThickness * 3);
    removeRectObstacle(
      obstacles, 
      passageX,
      wall.y - wallThickness/2, 
      wallThickness * 3, 
      wallThickness * 2, 
      gridSize
    );
  });

  return obstacles;
};