export interface Coordinates {
  x: number;
  y: number;
}

export interface Particle extends Coordinates {
  targetX: number;
  targetY: number;
  initialX: number;
  initialY: number;
  t?: number;
  controlX?: number;
  controlY?: number;
}
