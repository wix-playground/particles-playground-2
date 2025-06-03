import {Action, MessagePayloadMap, WorkerMessage, StartPositionType, FontState, InitializeMessagePayload, UpdateSelectedMovementFunctionPayload} from "./interfaces";

export class WorkerMessenger {
  constructor(private worker: Worker | null) { }

  private send<T extends Action>(type: T, payload: MessagePayloadMap[T]): void {
    if (!this.worker) {
      console.warn(`Cannot send message ${type}: worker not available`);
      return;
    }

    const message: WorkerMessage<T> = {type, payload};
    this.worker.postMessage(message);
  }

  private sendWithTransferables<T extends Action>(
    type: T,
    payload: MessagePayloadMap[T],
    transferables: Transferable[]
  ): void {
    if (!this.worker) {
      console.warn(`Cannot send message ${type}: worker not available`);
      return;
    }

    const message: WorkerMessage<T> = {type, payload};
    this.worker.postMessage(message, transferables);
  }

  // Type-safe convenience methods for common actions
  updateText = (text: string) => this.send(Action.UPDATE_TEXT, text);
  updateDelay = (delay: number) => this.send(Action.UPDATE_DELAY, delay);
  updateParticleColors = (colors: string[]) => this.send(Action.UPDATE_PARTICLE_COLORS, colors);
  updateAnimationDuration = (duration: number) => this.send(Action.UPDATE_ANIMATION_DURATION, duration);
  updateStartPosition = (position: StartPositionType) => this.send(Action.UPDATE_START_POSITION, position);
  updateFont = (font: FontState) => this.send(Action.UPDATE_FONT, font);
  updateParticleRadius = (radius: number) => this.send(Action.RESIZE_PARTICLE_RADIUS, radius);
  updateParticleSpread = (spread: number) => this.send(Action.UPDATE_PARTICLE_SPREAD, spread);
  updateStartParticleOpacity = (opacity: number) => this.send(Action.UPDATE_START_PARTICLE_OPACITY, opacity);
  updateEndParticleOpacity = (opacity: number) => this.send(Action.UPDATE_END_PARTICLE_OPACITY, opacity);
  updateStartParticleSize = (size: number) => this.send(Action.UPDATE_START_PARTICLE_SIZE, size);
  updateEndParticleSize = (size: number) => this.send(Action.UPDATE_END_PARTICLE_SIZE, size);

  // Lifecycle methods
  play = () => this.send(Action.PLAY, undefined);
  reset = () => this.send(Action.RESET, undefined);

  // Complex operations
  initialize = (payload: InitializeMessagePayload, transferables: Transferable[]) =>
    this.sendWithTransferables(Action.INITIALIZE, payload, transferables);

  updateBitmap = (bitmap: ImageBitmap) =>
    this.sendWithTransferables(Action.UPDATE_BITMAP, bitmap, [bitmap]);

  updateSelectedMovementFunction = (payload: UpdateSelectedMovementFunctionPayload) =>
    this.send(Action.UPDATE_SELECTED_MOVEMENT_FUNCTION, payload);
}
