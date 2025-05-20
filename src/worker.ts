import {
  DEFAULT_FONT_STATE,
  DEFAULT_MOVEMENT_FUNCTION_KEY,
  DEFAULT_PARTICLE_RADIUS,
  DEFAULT_PARTICLES_TEXT,
  DEFAULT_START_POSITION,
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
} from './interfaces';
import {getPredefinedMovementOptions} from './movement';
import {getStartCoordinatesConfig, getValidImageBlocks} from './utils';

let customMovementFunction: (
  particle: Particle,
  animationStartTime: number,
  requestAnimationFrameTime: number,
  canvasDimensions: Dimensions
) => void;

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
  appProps: {
    particleRadius: DEFAULT_PARTICLE_RADIUS,
    startPosition: DEFAULT_START_POSITION,
    selectedMovementFunction: DEFAULT_MOVEMENT_FUNCTION_KEY,
    movementFunctionCode:
      getPredefinedMovementOptions()[DEFAULT_MOVEMENT_FUNCTION_KEY].code,
    text: DEFAULT_PARTICLES_TEXT,
    font: DEFAULT_FONT_STATE,
  },
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

const initialize = (data: InitializeMessagePayload) => {
  const {imageBitmap: _imageBitmap, canvas, dimensions, appProps} = data;
  workerState.imageBitmap = _imageBitmap;

  if (Object.keys(appProps).length) {
    workerState.appProps = {...appProps};
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
  });
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

  workerState.workerParticles.forEach((particle,) => {
    // Update particles position by calling your movement function here:
    customMovementFunction(
      particle,
      animationStartTime,
      requestAnimationFrameTime,
      {
        width: workerState.mainCanvas!.width,
        height: workerState.mainCanvas!.height,
      }
    );

    // Calculate distance to target as percentage (0-1)
    const dx = particle.targetX - particle.initialX;
    const dy = particle.targetY - particle.initialY;
    const initialDistance = Math.sqrt(dx * dx + dy * dy);

    const currentDx = particle.targetX - particle.x;
    const currentDy = particle.targetY - particle.y;
    const currentDistance = Math.sqrt(currentDx * currentDx + currentDy * currentDy);

    // Update reveal progress based on distance traveled
    const distanceProgress = initialDistance > 0 ? 1 - (currentDistance / initialDistance) : 1;

    // Randomly vary the reveal threshold for each particle if not already set
    if (particle.revealThreshold === undefined) {
      particle.revealThreshold = 0.7 + Math.random() * 0.25; // Between 0.7 and 0.95
    }

    // Set reveal progress based on distance progress and threshold
    particle.revealProgress = distanceProgress >= particle.revealThreshold ?
      Math.min(1, (distanceProgress - particle.revealThreshold) / (1 - particle.revealThreshold) * 3) : 0;

    // Draw particle on frame context based on reveal progress
    if (particle.revealProgress >= 1) {
      // Fully revealed - draw the image part
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
      // Not fully revealed - draw a circle with possible image blending
      const radius = Math.floor(workerState.appProps.particleRadius * (particle.scale || 1));

      if (particle.revealProgress > 0) {
        // Draw partial image with reduced opacity based on reveal progress
        workerState.frameContext!.globalAlpha = particle.revealProgress * (particle.opacity || 1);
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
        workerState.frameContext!.globalAlpha = 1;
      }

      // Draw circle with reduced opacity based on reveal progress
      workerState.frameContext!.beginPath();
      workerState.frameContext!.arc(
        Math.floor(particle.x) + radius / 2,
        Math.floor(particle.y) + radius / 2,
        radius / 2,
        0,
        Math.PI * 2
      );
      workerState.frameContext!.fillStyle = particle.color || '#ffffff';
      if (particle.opacity !== undefined) {
        workerState.frameContext!.globalAlpha = (1 - particle.revealProgress) * particle.opacity;
      } else {
        workerState.frameContext!.globalAlpha = 1 - particle.revealProgress;
      }
      workerState.frameContext!.fill();
      workerState.frameContext!.globalAlpha = 1;
    }

    if (particle.x !== particle.targetX || particle.y !== particle.targetY) {
      particlesReachedTarget = false;
    }
  });

  const frameBitmap = workerState.frameCanvas!.transferToImageBitmap();
  workerState.mainContext!.transferFromImageBitmap(frameBitmap);

  if (particlesReachedTarget) {
    if (workerState.animationFrameId) {
      cancelAnimationFrame(workerState.animationFrameId);
    }
  } else {
    workerState.animationFrameId = requestAnimationFrame(
      (requestAnimationFrameTime) =>
        renderParticles(animationStartTime, requestAnimationFrameTime)
    );
  }
};

const play = () => {
  customMovementFunction = new Function(
    workerState.appProps.movementFunctionCode
  )();
  const startTime = performance.now();
  renderParticles(startTime, startTime);
};

self.onmessage = (event: MessageEvent<MainThreadMessage>) => {
  // TODO: move to reducer.ts, create a state
  // TODO: do type magic

  const {payload, type} = event.data;

  switch (type) {
    case Action.INITIALIZE: {
      initialize(payload);
      self.postMessage({
        type: WorkerAction.INITIALIZED,
        data: workerState.appProps,
      });
      break;
    }
    case Action.PLAY: {
      play();
      break;
    }
    case Action.RESET: {
      workerState.workerParticles = workerState.workerParticles.map(
        (particle) => {
          const initialCoordinates =
            startCoordinatesConfig[
              workerState.appProps.startPosition as StartPositionType
            ]();
          return {
            x: initialCoordinates.x,
            y: initialCoordinates.y,
            initialX: initialCoordinates.x,
            initialY: initialCoordinates.y,
            targetX: particle.targetX,
            targetY: particle.targetY,
            scale: particle.scale,
            opacity: particle.opacity,
            color: particle.color,
            revealProgress: 0,
            revealThreshold: particle.revealThreshold,
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
      break;
    }
    case Action.RESIZE_PARTICLE_RADIUS: {
      workerState.appProps.particleRadius = payload;
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

      workerState.workerParticles = generateParticles({
        validBlocks: workerState.validBlocks,
        radius: workerState.appProps.particleRadius,
        blockHeight: workerState.blockHeight,
        blockWidth: workerState.blockWidth,
        startPosition: workerState.appProps.startPosition,
      });

      console.log('workerState.workerParticles', workerState.workerParticles);

      self.postMessage({
        type: WorkerAction.UPDATE_APP_PROPS,
        data: workerState.appProps,
      });

      if (workerState.animationFrameId) {
        cancelAnimationFrame(workerState.animationFrameId);
        const startTime = performance.now();
        renderParticles(startTime, startTime);
      }
      break;
    }
    case Action.UPDATE_START_POSITION: {
      // TODO: fix start position for easing ??
      workerState.appProps.startPosition = payload;

      if (workerState.workerParticles.length) {
        workerState.workerParticles.forEach((particle) => {
          const initialCoordinates =
            startCoordinatesConfig[workerState.appProps.startPosition]();
          particle.initialX = initialCoordinates.x;
          particle.initialY = initialCoordinates.y;
          particle.x = initialCoordinates.x;
          particle.y = initialCoordinates.y;
        });

        self.postMessage({
          type: WorkerAction.UPDATE_APP_PROPS,
          data: workerState.appProps,
        });

        if (workerState.animationFrameId) {
          cancelAnimationFrame(workerState.animationFrameId);
          const startTime = performance.now();
          renderParticles(startTime, startTime);
        }
      } else {
        console.error(
          'updateStartPosition failed, particles were not initialized',
          {
            workerParticles: workerState.workerParticles,
          }
        );
      }
      break;
    }
    case Action.UPDATE_SELECTED_MOVEMENT_FUNCTION: {
      const {key, movementFunctionCode} = payload ?? {};
      if (key) {
        workerState.appProps.selectedMovementFunction = key;
      }
      if (movementFunctionCode !== undefined && movementFunctionCode !== null) {
        workerState.appProps.movementFunctionCode = movementFunctionCode;
      }

      self.postMessage({
        type: WorkerAction.UPDATE_APP_PROPS,
        data: workerState.appProps,
      });
      break;
    }
    case Action.UPDATE_TEXT: {
      workerState.appProps.text = payload;

      self.postMessage({
        type: WorkerAction.UPDATE_APP_PROPS,
        data: workerState.appProps,
      });
      break;
    }
    case Action.UPDATE_FONT: {
      workerState.appProps.font = payload;

      self.postMessage({
        type: WorkerAction.UPDATE_APP_PROPS,
        data: workerState.appProps,
      });
      break;
    }
    case Action.UPDATE_BITMAP: {
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

        workerState.workerParticles = generateParticles({
          validBlocks: workerState.validBlocks,
          radius: workerState.appProps.particleRadius,
          blockHeight: workerState.blockHeight,
          blockWidth: workerState.blockWidth,
          startPosition: workerState.appProps.startPosition,
        });
      }
      break;
    }
    default:
      break;
  }
};

const generateParticles = ({
  validBlocks,
  radius,
  blockHeight,
  blockWidth,
  startPosition,
}: {
  validBlocks: Uint8Array<ArrayBuffer>;
  radius: number;
  blockHeight: number;
  blockWidth: number;
  startPosition: StartPositionType;
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
        particles.push({
          targetX: x,
          targetY: y,
          x: initialX,
          y: initialY,
          initialX,
          initialY,
          scale: 1,
          opacity: 1,
          color: '#ffffff',
          revealProgress: 0,
          revealThreshold: 0.7 + Math.random() * 0.25, // Between 0.7 and 0.95
        });
      }
    }
  }

  console.log('Particles amount: ', particles.length);
  return particles;
};
