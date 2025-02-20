export interface Coordinates {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
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

export type StartPositionType =
  | 'top-left'
  | 'top-right'
  | 'top'
  | 'center'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom'
  | 'left'
  | 'right'
  | 'random';
