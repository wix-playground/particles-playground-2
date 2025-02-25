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
  UPDATE_SELECTED_MOVEMENT_FUNCTION = 'UPDATE_SELECTED_MOVEMENT_FUNCTION',
  UPDATE_BITMAP = 'UPDATE_BITMAP',
  UPDATE_TEXT = 'UPDATE_TEXT',
}

export enum WorkerAction {
  INITIALIZED = 'INITIALIZED',
  UPDATE_APP_PROPS = 'UPDATE_APP_PROPS',
}

export interface AppProps {
  startPosition: StartPositionType;
  movementFunctionCode: string;
  selectedMovementFunction: string;
  particleRadius: number;
  text: string;
}
