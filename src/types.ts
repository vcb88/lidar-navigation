// types.ts

export interface Point {
    x: number;
    y: number;
  }
  
  export interface GridCell {
    x: number;
    y: number;
  }
  
  export interface Obstacle {
    gridKey: string;
    discovered: boolean;
  }
  
  export interface MapConfig {
    width: number;
    height: number;
    gridSize: number;
    wallThickness: number;
  }
  
  export interface RobotConfig {
    size: number;
    lidarRadius: number;
    position: Point;
  }
  
  export interface PathfindingResult {
    path: Point[];
    iterations: number;
  }
  
  export interface VisibilityCheckResult {
    isVisible: boolean;
    rayIntersections: Point[];
  }