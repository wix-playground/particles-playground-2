import {
  DEFAULT_FONT_STATE,
  DEFAULT_MOVEMENT_FUNCTION_KEY,
  DEFAULT_PARTICLE_COLOR,
  DEFAULT_PARTICLE_COLORS,
  DEFAULT_PARTICLE_RADIUS,
  DEFAULT_PARTICLES_TEXT,
  DEFAULT_START_POSITION,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_ENABLE_BUBBLES,
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
import {getStartCoordinatesConfig, getValidImageBlocks, getColorFromProgress} from './utils';

let customMovementFunction: (
  particle: Particle,
  animationStartTime: number,
  requestAnimationFrameTime: number,
  canvasDimensions: Dimensions,
  animationDuration: number
) => void;

// Add BubbleParticle interface
interface BubbleParticle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

const workerState: {
  // Internal worker state
  workerParticles: Particle[];
  bubbleParticles: BubbleParticle[];
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
  bubbleParticles: [],
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
    particleColors: DEFAULT_PARTICLE_COLORS,
    animationDuration: DEFAULT_ANIMATION_DURATION,
    enableBubbles: DEFAULT_ENABLE_BUBBLES,
  },
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

const initialize = (data: InitializeMessagePayload) => {
  const {imageBitmap: _imageBitmap, canvas, dimensions, appProps} = data;
  workerState.imageBitmap = _imageBitmap;

  if (Object.keys(appProps).length) {
    workerState.appProps = {...appProps, animationDuration: appProps.animationDuration ?? DEFAULT_ANIMATION_DURATION};
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

// Add function to create bubble particles
const createBubbleParticles = (x: number, y: number, color: string, count: number = 5) => {
  const bubbles: BubbleParticle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2;
    bubbles.push({
      x,
      y,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed - 1, // Slight upward bias
      radius: 2 + Math.random() * 5,
      color,
      opacity: 0.7 + Math.random() * 0.3,
      life: 0,
      maxLife: 50 + Math.random() * 100
    });
  }
  return bubbles;
};

// Update generation to sort particles by X position for left-to-right reveal
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
          color: DEFAULT_PARTICLE_COLOR,
          revealProgress: 0,
          revealThreshold: 0.7 + Math.random() * 0.25, // Between 0.7 and 0.95
          reachedTarget: false,
          emittedBubbles: false
        });
      }
    }
  }

  return particles;
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

  // Update reveal progress - gradually unlock particles from left to right
  const elapsedTime = requestAnimationFrameTime - animationStartTime;
  workerState.revealProgress = Math.min(1, elapsedTime / workerState.appProps.animationDuration);

  // Update and render bubble particles
  for (let i = workerState.bubbleParticles.length - 1; i >= 0; i--) {
    const bubble = workerState.bubbleParticles[i];

    // Update bubble position
    bubble.x += bubble.dx;
    bubble.y += bubble.dy;

    // Apply gentle wind effect
    bubble.dx += (Math.random() - 0.5) * 0.1;
    bubble.dy -= 0.02; // Slight upward drift

    // Update life
    bubble.life++;

    // Fade out based on life
    const lifeRatio = bubble.life / bubble.maxLife;
    const opacity = bubble.opacity * (1 - lifeRatio);

    // Draw bubble
    workerState.frameContext!.beginPath();
    workerState.frameContext!.arc(
      Math.floor(bubble.x),
      Math.floor(bubble.y),
      bubble.radius,
      0,
      Math.PI * 2
    );
    workerState.frameContext!.fillStyle = getColorFromProgress(
      workerState.appProps.particleColors,
      lifeRatio
    );
    workerState.frameContext!.globalAlpha = opacity;
    workerState.frameContext!.fill();

    // Remove dead bubbles
    if (bubble.life >= bubble.maxLife) {
      workerState.bubbleParticles.splice(i, 1);
    }
  }

  // Reset alpha for particle rendering
  workerState.frameContext!.globalAlpha = 1;

  workerState.workerParticles.forEach((particle, index) => {
    // Only animate particles that have been "unlocked" based on left-to-right progress
    const particleRevealIndex = index / workerState.workerParticles.length;
    const shouldReveal = particleRevealIndex <= workerState.revealProgress;

    if (shouldReveal) {
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

      // Calculate particle color based on the color gradient if there are colors specified
      if (workerState.appProps.particleColors?.length > 0) {
        if (workerState.appProps.particleColors.length === 1) {
          // If there's only one color, use that color
          particle.color = workerState.appProps.particleColors[0];
        } else {
          // Otherwise use gradient interpolation
          particle.color = getColorFromProgress(
            workerState.appProps.particleColors,
            distanceProgress
          );
        }
      }

      // Check if particle reached target
      const hasReachedTarget = Math.abs(particle.x - particle.targetX) < 0.5 &&
        Math.abs(particle.y - particle.targetY) < 0.5;

      // Emit bubbles when particle reaches target for the first time (if enabled)
      if (hasReachedTarget && !particle.emittedBubbles && workerState.appProps.enableBubbles) {
        particle.emittedBubbles = true;
        const bubbles = createBubbleParticles(
          particle.x,
          particle.y,
          particle.color,
          2 + Math.floor(Math.random() * 3)
        );
        workerState.bubbleParticles.push(...bubbles);
      }

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
        workerState.frameContext!.fillStyle = particle.color;
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
    } else {
      // Particles that haven't been revealed yet should be considered not at target
      particlesReachedTarget = false;
    }
  });

  const frameBitmap = workerState.frameCanvas!.transferToImageBitmap();
  workerState.mainContext!.transferFromImageBitmap(frameBitmap);

  // Continue animation if particles haven't reached target or bubbles are still active
  if (!particlesReachedTarget || workerState.bubbleParticles.length > 0) {
    workerState.animationFrameId = requestAnimationFrame(
      (requestAnimationFrameTime) =>
        renderParticles(animationStartTime, requestAnimationFrameTime)
    );
  } else {
    if (workerState.animationFrameId) {
      cancelAnimationFrame(workerState.animationFrameId);
      workerState.frameContext!.drawImage(workerState.imageBitmap!, 0, 0);
      // Clear any remaining bubbles
      workerState.bubbleParticles = [];
    }
  }
};

const play = () => {
  customMovementFunction = new Function(
    workerState.appProps.movementFunctionCode
  )();
  const startTime = performance.now();
  workerState.revealProgress = 0;
  workerState.bubbleParticles = [];
  // Reset emitted bubbles flag when playing again
  workerState.workerParticles.forEach(particle => {
    particle.emittedBubbles = false;
  });
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
      if (workerState.animationFrameId) {
        cancelAnimationFrame(workerState.animationFrameId);
      }

      // Clear any existing bubbles before starting new animation
      workerState.bubbleParticles = [];

      play();
      break;
    }
    case Action.RESET: {
      if (workerState.animationFrameId) {
        cancelAnimationFrame(workerState.animationFrameId);
      }
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
            scale: 1,
            opacity: 1,
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
    case Action.UPDATE_PARTICLE_COLORS: {
      workerState.appProps.particleColors = payload;

      // Remove setting particleColor as it doesn't exist in AppProps interface
      if (payload.length > 0) {
        // The particleColor property doesn't exist on AppProps
        // workerState.appProps.particleColor = payload[0];
      }

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
    case Action.UPDATE_ANIMATION_DURATION: {
      workerState.appProps.animationDuration = payload;

      self.postMessage({
        type: WorkerAction.UPDATE_APP_PROPS,
        data: workerState.appProps,
      });

      // If animation is currently running, clear bubbles
      if (workerState.animationFrameId) {
        workerState.bubbleParticles = [];
      }
      break;
    }
    case Action.UPDATE_ENABLE_BUBBLES: {
      workerState.appProps.enableBubbles = payload;

      self.postMessage({
        type: WorkerAction.UPDATE_APP_PROPS,
        data: workerState.appProps,
      });
      break;
    }
    default:
      break;
  }
};
