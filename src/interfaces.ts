export interface Coordinates {
  x: number;
  y: number;
}

export interface Particle extends Coordinates {
  targetX: number;
  targetY: number;
  initialX: number;
  initialY: number;
  vx: number;
  vy: number;
  startDelay: number;
  speed: number;
  angle?: number;
  t?: number;
  controlX?: number;
  controlY?: number;
}
