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
  scale: number;
  opacity: number;
  color: string;
  revealProgress?: number;
  revealThreshold?: number;
  emittedBubbles?: boolean;
  reachedTarget?: boolean;
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
  UPDATE_FONT = 'UPDATE_FONT',
  UPDATE_PARTICLE_COLORS = 'UPDATE_PARTICLE_COLORS',
  UPDATE_ANIMATION_DURATION = 'UPDATE_ANIMATION_DURATION',
  UPDATE_ENABLE_BUBBLES = 'UPDATE_ENABLE_BUBBLES',
}

export enum WorkerAction {
  INITIALIZED = 'INITIALIZED',
  UPDATE_APP_PROPS = 'UPDATE_APP_PROPS',
}

export type FontState = {
  fontFamily: FontFamily;
  fontSize: number;
  italic: boolean;
  weight: number;
  letterSpacing: number; // number in px
};

export const getUpdateFontMessage = (payload: FontState) => ({
  type: Action.UPDATE_FONT as const,
  payload,
});

export interface InitializeMessagePayload {
  canvas: OffscreenCanvas;
  dimensions: Dimensions;
  imageBitmap: ImageBitmap;
  appProps: AppProps;
}

export const getInitializeMessage = (payload: InitializeMessagePayload) => ({
  type: Action.INITIALIZE as const,
  payload,
});

export const getPlayMessage = () => ({
  type: Action.PLAY as const,
  payload: undefined,
});

export const getResetMessage = () => ({
  type: Action.RESET as const,
  payload: undefined,
});

export const getResizeParticleRadiusMessage = (payload: number) => ({
  type: Action.RESIZE_PARTICLE_RADIUS as const,
  payload,
});

export const getUpdateStartPositionMessage = (payload: StartPositionType) => ({
  type: Action.UPDATE_START_POSITION as const,
  payload,
});

export const getUpdateSelectedMovementFunctionMessage = (payload: {
  key?: string;
  movementFunctionCode?: string;
}) => ({
  type: Action.UPDATE_SELECTED_MOVEMENT_FUNCTION as const,
  payload,
});

export const getUpdateBitmapMessage = (payload: ImageBitmap) => ({
  type: Action.UPDATE_BITMAP as const,
  payload,
});

export const getUpdateTextMessage = (payload: string) => ({
  type: Action.UPDATE_TEXT as const,
  payload,
});

export const getUpdateParticleColorsMessage = (payload: string[]) => ({
  type: Action.UPDATE_PARTICLE_COLORS as const,
  payload,
});

export const getUpdateAnimationDurationMessage = (payload: number) => ({
  type: Action.UPDATE_ANIMATION_DURATION as const,
  payload,
});

export const getUpdateEnableBubblesMessage = (payload: boolean) => ({
  type: Action.UPDATE_ENABLE_BUBBLES as const,
  payload,
});

export type MainThreadMessage =
  | ReturnType<typeof getUpdateBitmapMessage>
  | ReturnType<typeof getUpdateTextMessage>
  | ReturnType<typeof getUpdateSelectedMovementFunctionMessage>
  | ReturnType<typeof getUpdateStartPositionMessage>
  | ReturnType<typeof getResizeParticleRadiusMessage>
  | ReturnType<typeof getResetMessage>
  | ReturnType<typeof getPlayMessage>
  | ReturnType<typeof getInitializeMessage>
  | ReturnType<typeof getUpdateFontMessage>
  | ReturnType<typeof getUpdateParticleColorsMessage>
  | ReturnType<typeof getUpdateAnimationDurationMessage>
  | ReturnType<typeof getUpdateEnableBubblesMessage>;

export const fontFamilies = [
  'Arial',
  'Pirata One',
  'Poppins',
  'Press Start 2P',
  'Modak',
  'UnifrakturMaguntia',
  'Junge',
  'Ojuju',
  'Syne',
  'Sora',
  'K2D',
  'Playfair',
  'Luxurious Script',
  'Fraunces',
  'Belinda',
  'DIN',
] as const;

export type FontFamily = (typeof fontFamilies)[number];

export interface AppProps {
  startPosition: StartPositionType;
  movementFunctionCode: string;
  selectedMovementFunction: string;
  particleRadius: number;
  text: string;
  font: FontState;
  particleColors: string[];
  animationDuration: number;
  enableBubbles: boolean;
}
