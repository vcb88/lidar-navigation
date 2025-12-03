import { Point, CellType } from '../types';

export const castRays = (
  position: Point,
  rotation: number,
  trueGrid: CellType[][],
  width: number,
  height: number,
  radius: number = 5,
  fov: number = Math.PI * 2,
  raysCount: number = 60
): { hits: Point[], discoveredWalls: Point[], discoveredEmpty: Point[] } => {
  const hits: Point[] = [];
  const discoveredWalls: Point[] = [];
  const discoveredEmpty: Point[] = [];

  const startAngle = rotation - fov / 2;
  const step = fov / raysCount;

  for (let i = 0; i < raysCount; i++) {
    const angle = startAngle + step * i;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    let x = position.x;
    let y = position.y;
    let dist = 0;

    while (dist < radius) {
      dist += 0.1; // Precision step
      x += dx * 0.1;
      y += dy * 0.1;

      const gridX = Math.round(x);
      const gridY = Math.round(y);

      if (gridX < 0 || gridX >= width || gridY < 0 || gridY >= height) {
        hits.push({ x, y });
        break;
      }

      // Mark empty space as discovered
      discoveredEmpty.push({ x: gridX, y: gridY });

      if (trueGrid[gridY][gridX] === CellType.Wall) {
        hits.push({ x, y });
        discoveredWalls.push({ x: gridX, y: gridY });
        break;
      }
    }
    if (dist >= radius) hits.push({ x, y });
  }

  return { hits, discoveredWalls, discoveredEmpty };
};
