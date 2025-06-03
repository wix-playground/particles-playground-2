import {
  DEFAULT_FONT_STATE,
  DEFAULT_MOVEMENT_FUNCTION_KEY,
  DEFAULT_PARTICLE_COLOR,
  DEFAULT_PARTICLE_COLORS,
  DEFAULT_PARTICLE_RADIUS,
  DEFAULT_PARTICLES_TEXT,
  DEFAULT_START_POSITION,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_PARTICLE_SPREAD,
  DEFAULT_START_PARTICLE_OPACITY,
  DEFAULT_END_PARTICLE_OPACITY,
  DEFAULT_START_PARTICLE_SIZE,
  DEFAULT_END_PARTICLE_SIZE,
  DEFAULT_DELAY,
} from './constants';
import {
  Particle,
  StartPositionType,
  Action,
  WorkerAction,
  AppProps,
  Dimensions,
  MainThreadMessage,
  InitializeMessagePayload,
  MessagePayloadMap,
} from './interfaces';
import {getPredefinedMovementOptions} from './movement';
import {
  getStartCoordinatesConfig,
  getValidImageBlocks,
  getColorFromProgress,
} from './utils';

let customMovementFunction: (
  particle: Particle,
  animationStartTime: number,
  requestAnimationFrameTime: number,
  canvasDimensions: Dimensions,
  animationDuration: number
) => void;

const defaultAppProps: AppProps = {
  particleRadius: DEFAULT_PARTICLE_RADIUS,
  startPosition: DEFAULT_START_POSITION,
  selectedMovementFunction: DEFAULT_MOVEMENT_FUNCTION_KEY,
  movementFunctionCode:
    getPredefinedMovementOptions()[DEFAULT_MOVEMENT_FUNCTION_KEY].code,
  text: DEFAULT_PARTICLES_TEXT,
  font: DEFAULT_FONT_STATE,
  particleColors: DEFAULT_PARTICLE_COLORS,
  animationDuration: DEFAULT_ANIMATION_DURATION,
  particleSpread: DEFAULT_PARTICLE_SPREAD,
  startParticleOpacity: DEFAULT_START_PARTICLE_OPACITY,
  endParticleOpacity: DEFAULT_END_PARTICLE_OPACITY,
  startParticleSize: DEFAULT_START_PARTICLE_SIZE,
  endParticleSize: DEFAULT_END_PARTICLE_SIZE,
  delay: DEFAULT_DELAY,
};

const workerState: {
  // Internal worker state
  workerParticles: Particle[];
  imageBitmap: ImageBitmap | null;
  animationFrameId: number;
  frameCanvas: OffscreenCanvas | null;
  frameContext: OffscreenCanvasRenderingContext2D | null;
  mainCanvas: OffscreenCanvas | null;
  mainContext: ImageBitmapRenderingContext | null;
  validBlocks: Uint8Array<ArrayBuffer> | null;
  blockHeight: number;
  blockWidth: number;
  // Main thread facing props
  appProps: AppProps;
  revealProgress: number;
} = {
  workerParticles: [],
  imageBitmap: null,
  animationFrameId: 0,
  frameCanvas: null,
  frameContext: null,
  mainCanvas: null,
  mainContext: null,
  validBlocks: null,
  blockHeight: 0,
  blockWidth: 0,
  appProps: defaultAppProps,
  revealProgress: 0,
};

let startCoordinatesConfig: ReturnType<typeof getStartCoordinatesConfig>;

const initializeCanvas = async (canvas: OffscreenCanvas) => {
  workerState.mainCanvas = canvas;
  workerState.mainContext = workerState.mainCanvas.getContext(
    'bitmaprenderer'
  ) as ImageBitmapRenderingContext;

  workerState.frameCanvas = new OffscreenCanvas(
    workerState.mainCanvas.width,
    workerState.mainCanvas.height
  );
  workerState.frameContext = workerState.frameCanvas.getContext('2d', {
    willReadFrequently: true,
  })! as OffscreenCanvasRenderingContext2D;
};

const handleInitialize = (data: InitializeMessagePayload) => {
  const {imageBitmap: _imageBitmap, canvas, dimensions, appProps} = data;
  workerState.imageBitmap = _imageBitmap;

  if (Object.keys(appProps).length) {
    workerState.appProps = {...defaultAppProps, ...appProps};
  }

  initializeCanvas(canvas);
  workerState.frameContext!.drawImage(workerState.imageBitmap!, 0, 0);
  const {
    validBlocks: _validBlocks,
    blockHeight: _blockHeight,
    blockWidth: _blockWidth,
  } = getValidImageBlocks(
    workerState.frameContext!.getImageData(
      0,
      0,
      workerState.mainCanvas!.width,
      workerState.mainCanvas!.height
    ),
    workerState.appProps.particleRadius
  );

  workerState.validBlocks = _validBlocks;
  workerState.blockHeight = _blockHeight;
  workerState.blockWidth = _blockWidth;
  startCoordinatesConfig = getStartCoordinatesConfig({dimensions});

  workerState.workerParticles = generateParticles({
    validBlocks: workerState.validBlocks,
    radius: workerState.appProps.particleRadius,
    blockHeight: workerState.blockHeight,
    blockWidth: workerState.blockWidth,
    startPosition: workerState.appProps.startPosition,
    delay: workerState.appProps.delay,
    animationDuration: workerState.appProps.animationDuration,
  });

  self.postMessage({
    type: WorkerAction.INITIALIZED,
    data: workerState.appProps,
  });
};

const generateParticles = ({
  validBlocks,
  radius,
  blockHeight,
  blockWidth,
  startPosition,
  delay,
  animationDuration,
}: {
  validBlocks: Uint8Array<ArrayBuffer>;
  radius: number;
  blockHeight: number;
  blockWidth: number;
  startPosition: StartPositionType;
  delay: number;
  animationDuration: number;
}) => {
  const particles: Array<Particle> = [];

  for (let blockY = 0; blockY < blockHeight; blockY++) {
    for (let blockX = 0; blockX < blockWidth; blockX++) {
      const index = blockY * blockWidth + blockX;
      if (validBlocks[index]) {
        const x = blockX * radius;
        const y = blockY * radius;

        const {x: initialX, y: initialY} =
          startCoordinatesConfig[startPosition as StartPositionType]();

        const particleDelay = Math.random() * delay;
        const particleLifetime = animationDuration - particleDelay;

        particles.push({
          targetX: x,
          targetY: y,
          x: initialX,
          y: initialY,
          initialX,
          initialY,
          scale: 1,
          opacity: 1,
          color: DEFAULT_PARTICLE_COLOR,
          revealProgress: 0,
          revealThreshold: 0.97 + Math.random() * 0.02, // Between 0.97 and 0.99
          reachedTarget: false,
          emittedBubbles: false,
          delay: particleDelay,
          lifetime: particleLifetime,
        });
      }
    }
  }

  return particles;
};

// Add function to calculate transition blend factor
const getTransitionBlendFactor = (particle: Particle, revealProgress: number): number => {
  // Check if reveal progress exceeds particle's threshold
  if (revealProgress > (particle.revealThreshold || 0.99)) {
    return 1; // Fully image
  }

  // Check if particle is within 5 pixels of target and progress > 85%
  if (revealProgress > 0.85) {
    const distanceToTarget = Math.sqrt(
      Math.pow(particle.x - particle.targetX, 2) +
      Math.pow(particle.y - particle.targetY, 2)
    );
    if (distanceToTarget <= 5) {
      // Create a smooth transition over the last 2% of reveal progress
      const threshold = particle.revealThreshold || 0.99;
      const transitionStart = threshold - 0.02;
      const transitionProgress = Math.max(0, (revealProgress - transitionStart) / 0.02);
      return Math.min(1, transitionProgress);
    }
  }

  return 0; // Fully circle
};

// Add function to calculate current particle opacity based on animation progress
const getCurrentParticleOpacity = (particleProgress: number): number => {
  // Interpolate between start and end opacity based on individual particle progress
  const startOpacity = workerState.appProps.startParticleOpacity;
  const endOpacity = workerState.appProps.endParticleOpacity;
  return startOpacity + (endOpacity - startOpacity) * particleProgress;
};

// Add function to calculate current particle size based on animation progress
const getCurrentParticleSize = (particleProgress: number): number => {
  // Interpolate between start and end size based on individual particle progress
  const startSize = workerState.appProps.startParticleSize;
  const endSize = workerState.appProps.endParticleSize;
  return startSize + (endSize - startSize) * particleProgress;
};

const renderParticles = (
  animationStartTime: number,
  requestAnimationFrameTime: number
) => {
  let particlesReachedTarget = true;
  workerState.frameContext!.clearRect(
    0,
    0,
    workerState.frameCanvas!.width,
    workerState.frameCanvas!.height
  );

  const elapsedTime = requestAnimationFrameTime - animationStartTime;
  workerState.revealProgress = Math.min(
    1,
    elapsedTime / workerState.appProps.animationDuration
  );

  // Reset alpha for particle rendering
  workerState.frameContext!.globalAlpha = 1;


  workerState.workerParticles.forEach((particle) => {

    if (particle.delay > requestAnimationFrameTime - animationStartTime) {
      return
    }

    // Calculate individual particle progress
    const elapsedTimeForParticle = elapsedTime - particle.delay;
    const individualParticleProgress = Math.max(0, Math.min(1, elapsedTimeForParticle / particle.lifetime));

    // Update particles position by calling your movement function here:
    customMovementFunction(
      particle,
      animationStartTime,
      requestAnimationFrameTime,
      {
        width: workerState.mainCanvas!.width,
        height: workerState.mainCanvas!.height,
      },
      workerState.appProps.animationDuration
    );

    const blendFactor = getTransitionBlendFactor(particle, workerState.revealProgress);
    const currentOpacity = getCurrentParticleOpacity(individualParticleProgress);
    const currentSize = getCurrentParticleSize(individualParticleProgress);

    if (blendFactor > 0 && blendFactor < 1) {
      // Blending mode: draw both circle and image with appropriate opacities
      const radius =
        workerState.appProps.particleRadius * (currentSize || 1)


      // Draw circle with reduced opacity
      workerState.frameContext!.globalAlpha = currentOpacity * (1 - blendFactor);
      workerState.frameContext!.beginPath();
      workerState.frameContext!.arc(
        Math.floor(particle.x) + radius / 2,
        Math.floor(particle.y) + radius / 2,
        radius / 2,
        0,
        2 * Math.PI
      );
      workerState.frameContext!.fillStyle = workerState.appProps.particleColors
        .length
        ? getColorFromProgress(
          workerState.appProps.particleColors,
          workerState.revealProgress
        )
        : particle.color;
      workerState.frameContext!.fill();

      // Draw image with increasing opacity
      workerState.frameContext!.globalAlpha = blendFactor * currentOpacity;
      workerState.frameContext!.drawImage(
        workerState.imageBitmap!,
        particle.targetX,
        particle.targetY,
        currentSize,
        currentSize,
        Math.floor(particle.x),
        Math.floor(particle.y),
        currentSize,
        currentSize
      );
    } else if (blendFactor >= 1) {
      // Fully image
      workerState.frameContext!.globalAlpha = 1;
      workerState.frameContext!.drawImage(
        workerState.imageBitmap!,
        particle.targetX,
        particle.targetY,
        workerState.appProps.particleRadius,
        workerState.appProps.particleRadius,
        Math.floor(particle.x),
        Math.floor(particle.y),
        workerState.appProps.particleRadius,
        workerState.appProps.particleRadius
      );
    } else {
      // Fully circle
      const radius =
        workerState.appProps.particleRadius * (currentSize || 1)

      workerState.frameContext!.globalAlpha = currentOpacity;
      workerState.frameContext!.beginPath();
      workerState.frameContext!.arc(
        Math.floor(particle.x) + radius / 2,
        Math.floor(particle.y) + radius / 2,
        radius / 2,
        0,
        2 * Math.PI
      );
      workerState.frameContext!.fillStyle = workerState.appProps.particleColors
        .length
        ? getColorFromProgress(
          workerState.appProps.particleColors,
          workerState.revealProgress
        )
        : particle.color;
      workerState.frameContext!.fill();
    }

    if (
      particle.x !== particle.targetX ||
      particle.y !== particle.targetY ||
      workerState.revealProgress < 0.99
    ) {
      particlesReachedTarget = false;
    }
  });

  const frameBitmap = workerState.frameCanvas!.transferToImageBitmap();
  workerState.mainContext!.transferFromImageBitmap(frameBitmap);

  // Calculate if we should continue animation
  const animationComplete = particlesReachedTarget && workerState.revealProgress >= 1;

  const totalAnimationTime = workerState.appProps.animationDuration;
  const shouldStopAnimation = animationComplete &&
    elapsedTime >= totalAnimationTime

  if (!shouldStopAnimation) {
    workerState.animationFrameId = requestAnimationFrame(
      (requestAnimationFrameTime) =>
        renderParticles(animationStartTime, requestAnimationFrameTime)
    );
  } else {
    if (workerState.animationFrameId) {
      cancelAnimationFrame(workerState.animationFrameId);
      workerState.frameContext!.drawImage(workerState.imageBitmap!, 0, 0);

      // Send animation complete message to main thread
      self.postMessage({
        type: WorkerAction.ANIMATION_COMPLETE,
      });
    }
  }
};

const handlePlay = () => {
  if (workerState.animationFrameId) {
    cancelAnimationFrame(workerState.animationFrameId);
  }

  customMovementFunction = new Function(
    workerState.appProps.movementFunctionCode
  )();
  const startTime = performance.now();
  workerState.revealProgress = 0;
  renderParticles(startTime, startTime);
};

const handleReset = () => {
  if (workerState.animationFrameId) {
    cancelAnimationFrame(workerState.animationFrameId);
  }
  workerState.workerParticles = workerState.workerParticles.map(
    (particle) => {
      const initialCoordinates =
        startCoordinatesConfig[
          workerState.appProps.startPosition as StartPositionType
        ]();
      const particleDelay = Math.random() * workerState.appProps.delay;
      const particleLifetime = workerState.appProps.animationDuration - particleDelay;
      return {
        x: initialCoordinates.x,
        y: initialCoordinates.y,
        initialX: initialCoordinates.x,
        initialY: initialCoordinates.y,
        targetX: particle.targetX,
        targetY: particle.targetY,
        scale: 1,
        opacity: 1,
        color: particle.color,
        revealProgress: 0,
        revealThreshold: particle.revealThreshold,
        delay: particleDelay,
        lifetime: particleLifetime,
      };
    }
  );

  workerState.frameContext!.clearRect(
    0,
    0,
    workerState.frameCanvas!.width,
    workerState.frameCanvas!.height
  );
  const frameBitmap = workerState.frameCanvas!.transferToImageBitmap();
  workerState.mainContext!.transferFromImageBitmap(frameBitmap);

  if (workerState.animationFrameId) {
    cancelAnimationFrame(workerState.animationFrameId);
  }

}

const handleUpdateBitmap = (payload: MessagePayloadMap[Action.UPDATE_BITMAP]) => {
  workerState.imageBitmap = payload;
  if (workerState.frameCanvas && workerState.mainCanvas) {
    workerState.frameCanvas.width = workerState.imageBitmap!.width;
    workerState.frameCanvas.height = workerState.imageBitmap!.height;
    workerState.mainCanvas.width = workerState.imageBitmap!.width;
    workerState.mainCanvas.height = workerState.imageBitmap!.height;

    // TODO: duplication here, remove it later
    workerState.frameContext!.drawImage(workerState.imageBitmap!, 0, 0);
    const {
      validBlocks: _validBlocks,
      blockHeight: _blockHeight,
      blockWidth: _blockWidth,
    } = getValidImageBlocks(
      workerState.frameContext!.getImageData(
        0,
        0,
        workerState.mainCanvas!.width,
        workerState.mainCanvas!.height
      ),
      workerState.appProps.particleRadius
    );

    workerState.validBlocks = _validBlocks;
    workerState.blockHeight = _blockHeight;
    workerState.blockWidth = _blockWidth;
    startCoordinatesConfig = getStartCoordinatesConfig({
      dimensions: {
        width: workerState.mainCanvas.width,
        height: workerState.mainCanvas.height,
      },
    });

    workerState.frameContext!.clearRect(
      0,
      0,
      workerState.frameCanvas!.width,
      workerState.frameCanvas!.height
    );

    const frameBitmap = workerState.frameCanvas!.transferToImageBitmap();
    workerState.mainContext!.transferFromImageBitmap(frameBitmap);

    workerState.workerParticles = generateParticles({
      validBlocks: workerState.validBlocks,
      radius: workerState.appProps.particleRadius,
      blockHeight: workerState.blockHeight,
      blockWidth: workerState.blockWidth,
      startPosition: workerState.appProps.startPosition,
      delay: workerState.appProps.delay,
      animationDuration: workerState.appProps.animationDuration,
    });
  }
}

const handleUpdateAppProps = (payload: MessagePayloadMap[Action.UPDATE_APP_PROPS]) => {
  const {appProps} = payload;

  // Update the worker state with the new properties
  Object.assign(workerState.appProps, appProps);

  // Check if we need to regenerate particles based on specific properties
  if (appProps.particleRadius !== undefined) {
    // Particle radius changes require full regeneration with new image data
    workerState.frameContext!.drawImage(workerState.imageBitmap!, 0, 0);
    const {
      validBlocks: _validBlocks,
      blockHeight: _blockHeight,
      blockWidth: _blockWidth,
    } = getValidImageBlocks(
      workerState.frameContext!.getImageData(
        0,
        0,
        workerState.mainCanvas!.width,
        workerState.mainCanvas!.height
      ),
      workerState.appProps.particleRadius
    );

    workerState.validBlocks = _validBlocks;
    workerState.blockHeight = _blockHeight;
    workerState.blockWidth = _blockWidth;
  }

  if (appProps.startPosition !== undefined && workerState.workerParticles.length) {
    // Update start position coordinates for existing particles
    workerState.workerParticles.forEach((particle) => {
      const initialCoordinates = startCoordinatesConfig[workerState.appProps.startPosition]();
      particle.initialX = initialCoordinates.x;
      particle.initialY = initialCoordinates.y;
      particle.x = initialCoordinates.x;
      particle.y = initialCoordinates.y;
    });
  }

  // Regenerate particles if needed
  if (appProps.delay !== undefined) {
    workerState.workerParticles = generateParticles({
      validBlocks: workerState.validBlocks ?? new Uint8Array(),
      radius: workerState.appProps.particleRadius,
      blockHeight: workerState.blockHeight,
      blockWidth: workerState.blockWidth,
      startPosition: workerState.appProps.startPosition,
      delay: workerState.appProps.delay,
      animationDuration: workerState.appProps.animationDuration,
    });
  }

  // Send updated app props back to main thread
  self.postMessage({
    type: WorkerAction.UPDATE_APP_PROPS,
    data: workerState.appProps,
  });

  // Restart animation if needed
  if (workerState.animationFrameId) {
    cancelAnimationFrame(workerState.animationFrameId);
    const startTime = performance.now();
    renderParticles(startTime, startTime);
  }
};

self.onmessage = (event: MessageEvent<MainThreadMessage>) => {
  const {payload, type} = event.data;

  switch (type) {
    case Action.INITIALIZE: {
      handleInitialize(payload);
      break;
    }
    case Action.PLAY: {
      handlePlay();
      break;
    }
    case Action.RESET: {
      handleReset();
      break;
    }
    case Action.UPDATE_APP_PROPS: {
      handleUpdateAppProps(payload);
      break;
    }
    case Action.UPDATE_BITMAP: {
      handleUpdateBitmap(payload);
      break;
    }
    default:
      break;
  }
};
