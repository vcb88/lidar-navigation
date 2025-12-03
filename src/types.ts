export interface Point {
  x: number;
  y: number;
}

export enum CellType {
  Empty = '.',
  Wall = '#',
  Start = 'S',
  End = 'E',
  Unknown = '?', // For the robot's internal map
}

export interface MapData {
  grid: CellType[][];
  width: number;
  height: number;
  start: Point;
  end: Point;
}

export interface RobotState {
  position: Point; // Grid coordinates (float for smooth movement)
  rotation: number; // Radians
  path: Point[];   // Current planned path
  lidarRays: Point[]; // Visualization of laser hits
}
