import {Action, MessagePayloadMap, WorkerMessage, StartPositionType, FontState, InitializeMessagePayload, AppProps, ParticleSizeEasingType, ParticleOpacityEasingType, RevealDirection} from "./interfaces";
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

  // Single method for updating app properties
  updateAppProps = (
    appProps: Partial<AppProps>,
  ) => {
    this.send(Action.UPDATE_APP_PROPS, {
      appProps,
      shouldUpdateStartCoordinatesConfig: shouldUpdateStartCoordinatesConfig(appProps),
      shouldRegenerateImageBlocks: shouldRegenerateImageBlocks(appProps),
    });
  };

  // Convenience methods that use the unified updateAppProps
  updateText = (text: string) => this.updateAppProps({text});
  updateTextColor = (textColor: string) => this.updateAppProps({textColor});
  updateDelay = (delay: number) => this.updateAppProps({delay});
  updateParticleColors = (particleColors: string[]) => this.updateAppProps({particleColors});
  updateAnimationDuration = (animationDuration: number) => this.updateAppProps({animationDuration});
  updateStartPosition = (startPosition: StartPositionType) => this.updateAppProps({startPosition});
  updateFont = (font: FontState) => this.updateAppProps({font});
  updateParticleRadius = (particleRadius: number) => this.updateAppProps({particleRadius},);
  updateParticleSpread = (particleSpread: number) => this.updateAppProps({particleSpread});
  updateTurbulence = (turbulence: number) => this.updateAppProps({turbulence});
  updateWindSpeed = (windSpeed: number) => this.updateAppProps({windSpeed});
  updateWindDirection = (windDirection: number) => this.updateAppProps({windDirection});
  updateStartParticleOpacity = (startParticleOpacity: number) => this.updateAppProps({startParticleOpacity},);
  updateEndParticleOpacity = (endParticleOpacity: number) => this.updateAppProps({endParticleOpacity},);
  updateStartParticleSize = (startParticleSize: number) => this.updateAppProps({startParticleSize},);
  updateEndParticleSize = (endParticleSize: number) => this.updateAppProps({endParticleSize},);
  updateParticleSizeEasing = (particleSizeEasing: ParticleSizeEasingType) => this.updateAppProps({particleSizeEasing});
  updateParticleOpacityEasing = (particleOpacityEasing: ParticleOpacityEasingType) => this.updateAppProps({particleOpacityEasing});
  updateRevealAnimation = (enableRevealAnimation: boolean) => this.updateAppProps({enableRevealAnimation});
  updateRevealDirection = (revealDirection: RevealDirection) => this.updateAppProps({revealDirection});
  updateMaxEffectParticleLifetime = (maxEffectParticleLifetime: number) => this.updateAppProps({maxEffectParticleLifetime});

  updateSelectedMovementFunction = (selectedMovementFunction: string) =>
    this.updateAppProps({
      selectedMovementFunction
    });

  // Lifecycle methods
  play = () => this.send(Action.PLAY, undefined);
  reset = () => this.send(Action.RESET, undefined);

  // Complex operations
  initialize = (payload: InitializeMessagePayload, transferables: Transferable[]) =>
    this.sendWithTransferables(Action.INITIALIZE, payload, transferables);

  updateBitmap = (bitmap: ImageBitmap) =>
    this.sendWithTransferables(Action.UPDATE_BITMAP, bitmap, [bitmap]);
}

const shouldUpdateStartCoordinatesConfig = (appProps: Partial<AppProps>): boolean =>
  Boolean(
    appProps.startPosition !== undefined ||
    appProps.emitterX !== undefined ||
    appProps.emitterY !== undefined ||
    appProps.emitterSize !== undefined ||
    appProps.emitterAngle !== undefined
  );

const shouldRegenerateImageBlocks = (appProps: Partial<AppProps>): boolean => appProps.particleRadius !== undefined ||
  appProps.particleSpread !== undefined ||
  appProps.text !== undefined;
