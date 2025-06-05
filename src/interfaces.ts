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
  radius: number;
}

export type StartPositionType =
  | 'random'
  | 'canvasEdges'
  | 'center'
  | 'topLeft'
  | 'emitterPoint'
  | 'emitterCircle'
  | 'emitterSquare'
  | 'emitterHLine'
  | 'emitterVLine'
  | 'enterTopTextWidth'
  | 'enterBottomTextWidth'
  | 'enterLeftTextHeight'
  | 'enterRightTextHeight'
  | 'top-left'
  | 'top-right'
  | 'top'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom'
  | 'left'
  | 'right';

export enum Action {
  INITIALIZE = 'INITIALIZE',
  PLAY = 'PLAY',
  RESET = 'RESET',
  UPDATE_APP_PROPS = 'UPDATE_APP_PROPS',
  UPDATE_BITMAP = 'UPDATE_BITMAP',
  RESIZE_PARTICLE_RADIUS = 'RESIZE_PARTICLE_RADIUS',
  UPDATE_START_POSITION = 'UPDATE_START_POSITION',
  UPDATE_SELECTED_MOVEMENT_FUNCTION = 'UPDATE_SELECTED_MOVEMENT_FUNCTION',
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
  UPDATE_REVEAL_ANIMATION = 'UPDATE_REVEAL_ANIMATION',
  UPDATE_REVEAL_DIRECTION = 'UPDATE_REVEAL_DIRECTION',
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

export interface UpdateSelectedMovementFunctionPayload {
  key?: string;
  movementFunctionCode?: string;
}

export const getUpdateBitmapMessage = (payload: MessagePayloadMap[Action.UPDATE_BITMAP]) => ({
  type: Action.UPDATE_BITMAP as const,
  payload,
});

export interface UpdateAppPropsPayload {
  appProps: Partial<AppProps>;
  shouldUpdateStartCoordinatesConfig?: boolean;
  shouldRegenerateImageBlocks?: boolean;
}

export const getUpdateAppPropsMessage = (payload: MessagePayloadMap[Action.UPDATE_APP_PROPS]) => ({
  type: Action.UPDATE_APP_PROPS as const,
  payload,
});

export type MessagePayloadMap = {
  [Action.INITIALIZE]: InitializeMessagePayload;
  [Action.PLAY]: undefined;
  [Action.RESET]: undefined;
  [Action.UPDATE_APP_PROPS]: UpdateAppPropsPayload;
  [Action.UPDATE_BITMAP]: ImageBitmap;
  [Action.RESIZE_PARTICLE_RADIUS]: number;
  [Action.UPDATE_START_POSITION]: StartPositionType;
  [Action.UPDATE_SELECTED_MOVEMENT_FUNCTION]: UpdateSelectedMovementFunctionPayload;
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
  [Action.UPDATE_REVEAL_ANIMATION]: boolean;
  [Action.UPDATE_REVEAL_DIRECTION]: RevealDirection;
};
export type MainThreadMessage =
  | WorkerMessage<typeof Action.INITIALIZE>
  | WorkerMessage<typeof Action.PLAY>
  | WorkerMessage<typeof Action.RESET>
  | WorkerMessage<typeof Action.UPDATE_APP_PROPS>
  | WorkerMessage<typeof Action.UPDATE_BITMAP>
  | WorkerMessage<typeof Action.RESIZE_PARTICLE_RADIUS>
  | WorkerMessage<typeof Action.UPDATE_START_POSITION>
  | WorkerMessage<typeof Action.UPDATE_SELECTED_MOVEMENT_FUNCTION>
  | WorkerMessage<typeof Action.UPDATE_TEXT>
  | WorkerMessage<typeof Action.UPDATE_FONT>
  | WorkerMessage<typeof Action.UPDATE_PARTICLE_COLORS>
  | WorkerMessage<typeof Action.UPDATE_ANIMATION_DURATION>
  | WorkerMessage<typeof Action.UPDATE_PARTICLE_SPREAD>
  | WorkerMessage<typeof Action.UPDATE_START_PARTICLE_OPACITY>
  | WorkerMessage<typeof Action.UPDATE_END_PARTICLE_OPACITY>
  | WorkerMessage<typeof Action.UPDATE_START_PARTICLE_SIZE>
  | WorkerMessage<typeof Action.UPDATE_END_PARTICLE_SIZE>
  | WorkerMessage<typeof Action.UPDATE_DELAY>
  | WorkerMessage<typeof Action.UPDATE_REVEAL_ANIMATION>
  | WorkerMessage<typeof Action.UPDATE_REVEAL_DIRECTION>;

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

export type ParticleSizeEasingType =
  | 'bell'
  | 'linear'
  | 'multiPulse';

export type ParticleOpacityEasingType =
  | 'bell'
  | 'linear'
  | 'multiPulse';

export type RevealDirection = 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top';

export interface AppProps {
  particleRadius: number;
  startPosition: StartPositionType;
  selectedMovementFunction: string;
  movementFunctionCode: string;
  text: string;
  font: FontState;
  particleColors: string[];
  animationDuration: number;
  particleSpread: number;
  startParticleOpacity: number;
  endParticleOpacity: number;
  startParticleSize: number;
  endParticleSize: number;
  particleSizeEasing: ParticleSizeEasingType;
  particleOpacityEasing: ParticleOpacityEasingType;
  delay: number;
  emitterX: number;
  emitterY: number;
  emitterSize: number;
  emitterAngle: number;
  enableRevealAnimation: boolean;
  revealDirection: RevealDirection;
  turbulence: number;
  windSpeed: number;
}

export interface WorkerMessage<T extends Action = Action> {
  type: T;
  payload: MessagePayloadMap[T];
}


export interface EffectParticle {
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  startTime: number;
  lifetime: number;
  radius: number;
  opacity: number;
  color: string;
  progress: number;
}

export interface DrawableParticle {
  x: number;
  y: number;
  color: string;
  radius: number;
}
