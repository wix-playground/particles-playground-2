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

export enum Action {
  INITIALIZE = 'INITIALIZE',
  PLAY = 'PLAY',
  RESET = 'RESET',
  RESIZE_PARTICLE_RADIUS = 'RESIZE_PARTICLE_RADIUS',
  UPDATE_START_POSITION = 'UPDATE_START_POSITION',
}
