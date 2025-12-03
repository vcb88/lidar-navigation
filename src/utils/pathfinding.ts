import { Point, CellType } from '../types';

interface Node {
  x: number;
  y: number;
  g: number; // Cost from start
  h: number; // Heuristic to end
  f: number; // Total cost
  parent: Node | null;
}

const heuristic = (a: Point, b: Point) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

export const findPath = (
  start: Point,
  end: Point,
  grid: CellType[][],
  width: number,
  height: number
): Point[] => {
  const openList: Node[] = [];
  const closedSet = new Set<string>();
  
  // Round start/end to integer grid coordinates
  const startNode: Node = { 
    x: Math.round(start.x), 
    y: Math.round(start.y), 
    g: 0, 
    h: 0, 
    f: 0, 
    parent: null 
  };
  startNode.h = heuristic(startNode, end);
  startNode.f = startNode.h;
  
  openList.push(startNode);

  while (openList.length > 0) {
    // Sort by F cost (lowest first) - Naive priority queue
    openList.sort((a, b) => a.f - b.f);
    const current = openList.shift()!;

    if (current.x === Math.round(end.x) && current.y === Math.round(end.y)) {
      // Path found, reconstruct
      const path: Point[] = [];
      let curr: Node | null = current;
      while (curr) {
        path.push({ x: curr.x, y: curr.y });
        curr = curr.parent;
      }
      return path.reverse();
    }

    closedSet.add(`${current.x},${current.y}`);

    const neighbors = [
      { x: 0, y: -1 }, { x: 0, y: 1 },
      { x: -1, y: 0 }, { x: 1, y: 0 }
    ];

    for (const offset of neighbors) {
      const nx = current.x + offset.x;
      const ny = current.y + offset.y;

      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      if (grid[ny][nx] === CellType.Wall) continue;
      if (closedSet.has(`${nx},${ny}`)) continue;

      const g = current.g + 1;
      const h = heuristic({ x: nx, y: ny }, end);
      const f = g + h;

      const existingNode = openList.find(n => n.x === nx && n.y === ny);
      if (existingNode) {
        if (g < existingNode.g) {
          existingNode.g = g;
          existingNode.f = f;
          existingNode.parent = current;
        }
      } else {
        openList.push({ x: nx, y: ny, g, h, f, parent: current });
      }
    }
  }

  return []; // No path found
};
