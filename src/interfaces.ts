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
  delay: number;
  lifetime: number;
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
  UPDATE_PARTICLE_SPREAD = 'UPDATE_PARTICLE_SPREAD',
  UPDATE_START_PARTICLE_OPACITY = 'UPDATE_START_PARTICLE_OPACITY',
  UPDATE_END_PARTICLE_OPACITY = 'UPDATE_END_PARTICLE_OPACITY',
  UPDATE_START_PARTICLE_SIZE = 'UPDATE_START_PARTICLE_SIZE',
  UPDATE_END_PARTICLE_SIZE = 'UPDATE_END_PARTICLE_SIZE',
  UPDATE_DELAY = 'UPDATE_DELAY',
}

export enum WorkerAction {
  INITIALIZED = 'INITIALIZED',
  UPDATE_APP_PROPS = 'UPDATE_APP_PROPS',
  ANIMATION_COMPLETE = 'ANIMATION_COMPLETE',
}

export type FontState = {
  fontFamily: FontFamily;
  fontSize: number;
  italic: boolean;
  weight: number;
  letterSpacing: number; // number in px
  lineHeight: number; // line height multiplier
};

export const getUpdateFontMessage = (payload: MessagePayloadMap[Action.UPDATE_FONT]) => ({
  type: Action.UPDATE_FONT as const,
  payload,
});

export interface InitializeMessagePayload {
  canvas: OffscreenCanvas;
  dimensions: Dimensions;
  imageBitmap: ImageBitmap;
  appProps: AppProps;
}

export const getInitializeMessage = (payload: MessagePayloadMap[Action.INITIALIZE]) => ({
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

export const getResizeParticleRadiusMessage = (payload: MessagePayloadMap[Action.RESIZE_PARTICLE_RADIUS]) => ({
  type: Action.RESIZE_PARTICLE_RADIUS as const,
  payload,
});

export const getUpdateStartPositionMessage = (payload: MessagePayloadMap[Action.UPDATE_START_POSITION]) => ({
  type: Action.UPDATE_START_POSITION as const,
  payload,
});

export interface UpdateSelectedMovementFunctionPayload {
  key?: string;
  movementFunctionCode?: string;
}

export const getUpdateSelectedMovementFunctionMessage = (payload: MessagePayloadMap[Action.UPDATE_SELECTED_MOVEMENT_FUNCTION]) => ({
  type: Action.UPDATE_SELECTED_MOVEMENT_FUNCTION as const,
  payload,
});

export const getUpdateBitmapMessage = (payload: MessagePayloadMap[Action.UPDATE_BITMAP]) => ({
  type: Action.UPDATE_BITMAP as const,
  payload,
});

export const getUpdateTextMessage = (payload: MessagePayloadMap[Action.UPDATE_TEXT]) => ({
  type: Action.UPDATE_TEXT as const,
  payload,
});

export const getUpdateParticleColorsMessage = (payload: MessagePayloadMap[Action.UPDATE_PARTICLE_COLORS]) => ({
  type: Action.UPDATE_PARTICLE_COLORS as const,
  payload,
});

export const getUpdateAnimationDurationMessage = (payload: MessagePayloadMap[Action.UPDATE_ANIMATION_DURATION]) => ({
  type: Action.UPDATE_ANIMATION_DURATION as const,
  payload,
});

export const getUpdateParticleSpreadMessage = (payload: MessagePayloadMap[Action.UPDATE_PARTICLE_SPREAD]) => ({
  type: Action.UPDATE_PARTICLE_SPREAD as const,
  payload,
});

export const getUpdateStartParticleOpacityMessage = (payload: MessagePayloadMap[Action.UPDATE_START_PARTICLE_OPACITY]) => ({
  type: Action.UPDATE_START_PARTICLE_OPACITY as const,
  payload,
});

export const getUpdateEndParticleOpacityMessage = (payload: MessagePayloadMap[Action.UPDATE_END_PARTICLE_OPACITY]) => ({
  type: Action.UPDATE_END_PARTICLE_OPACITY as const,
  payload,
});

export const getUpdateStartParticleSizeMessage = (payload: MessagePayloadMap[Action.UPDATE_START_PARTICLE_SIZE]) => ({
  type: Action.UPDATE_START_PARTICLE_SIZE as const,
  payload,
});

export const getUpdateEndParticleSizeMessage = (payload: MessagePayloadMap[Action.UPDATE_END_PARTICLE_SIZE]) => ({
  type: Action.UPDATE_END_PARTICLE_SIZE as const,
  payload,
});

export const getUpdateDelayMessage = (payload: MessagePayloadMap[Action.UPDATE_DELAY]) => ({
  type: Action.UPDATE_DELAY as const,
  payload,
});


type MessageType =
  | typeof Action.INITIALIZE
  | typeof Action.PLAY
  | typeof Action.RESET
  | typeof Action.RESIZE_PARTICLE_RADIUS
  | typeof Action.UPDATE_START_POSITION
  | typeof Action.UPDATE_SELECTED_MOVEMENT_FUNCTION
  | typeof Action.UPDATE_BITMAP
  | typeof Action.UPDATE_TEXT
  | typeof Action.UPDATE_FONT
  | typeof Action.UPDATE_PARTICLE_COLORS
  | typeof Action.UPDATE_ANIMATION_DURATION
  | typeof Action.UPDATE_PARTICLE_SPREAD
  | typeof Action.UPDATE_START_PARTICLE_OPACITY
  | typeof Action.UPDATE_END_PARTICLE_OPACITY
  | typeof Action.UPDATE_START_PARTICLE_SIZE
  | typeof Action.UPDATE_END_PARTICLE_SIZE
  | typeof Action.UPDATE_DELAY;

export type MessagePayloadMap = {
  [Action.INITIALIZE]: InitializeMessagePayload;
  [Action.PLAY]: undefined;
  [Action.RESET]: undefined;
  [Action.RESIZE_PARTICLE_RADIUS]: number;
  [Action.UPDATE_START_POSITION]: StartPositionType;
  [Action.UPDATE_SELECTED_MOVEMENT_FUNCTION]: UpdateSelectedMovementFunctionPayload;
  [Action.UPDATE_BITMAP]: ImageBitmap;
  [Action.UPDATE_TEXT]: string;
  [Action.UPDATE_FONT]: FontState;
  [Action.UPDATE_PARTICLE_COLORS]: string[];
  [Action.UPDATE_ANIMATION_DURATION]: number;
  [Action.UPDATE_PARTICLE_SPREAD]: number;
  [Action.UPDATE_START_PARTICLE_OPACITY]: number;
  [Action.UPDATE_END_PARTICLE_OPACITY]: number;
  [Action.UPDATE_START_PARTICLE_SIZE]: number;
  [Action.UPDATE_END_PARTICLE_SIZE]: number;
  [Action.UPDATE_DELAY]: number;
};

type Message<T extends MessageType> = {
  type: T;
  payload: MessagePayloadMap[T];
};

export type MainThreadMessage =
  | Message<typeof Action.INITIALIZE>
  | Message<typeof Action.PLAY>
  | Message<typeof Action.RESET>
  | Message<typeof Action.RESIZE_PARTICLE_RADIUS>
  | Message<typeof Action.UPDATE_START_POSITION>
  | Message<typeof Action.UPDATE_SELECTED_MOVEMENT_FUNCTION>
  | Message<typeof Action.UPDATE_BITMAP>
  | Message<typeof Action.UPDATE_TEXT>
  | Message<typeof Action.UPDATE_FONT>
  | Message<typeof Action.UPDATE_PARTICLE_COLORS>
  | Message<typeof Action.UPDATE_ANIMATION_DURATION>
  | Message<typeof Action.UPDATE_PARTICLE_SPREAD>
  | Message<typeof Action.UPDATE_START_PARTICLE_OPACITY>
  | Message<typeof Action.UPDATE_END_PARTICLE_OPACITY>
  | Message<typeof Action.UPDATE_START_PARTICLE_SIZE>
  | Message<typeof Action.UPDATE_END_PARTICLE_SIZE>
  | Message<typeof Action.UPDATE_DELAY>

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
  particleSpread: number;
  startParticleOpacity: number;
  endParticleOpacity: number;
  startParticleSize: number;
  endParticleSize: number;
  delay: number
}
