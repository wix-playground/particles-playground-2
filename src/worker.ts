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
  DEFAULT_PARTICLE_SPREAD,
  BUBBLE_PARTICLE_LIFETIME,
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

// Add BubbleParticle interface
interface BubbleParticle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  color: string;
  opacity: number;
  createdAt: number; // Time when bubble was created
  lifetime: number; // How long the bubble should live (in ms)
}

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
  enableBubbles: DEFAULT_ENABLE_BUBBLES,
  particleSpread: DEFAULT_PARTICLE_SPREAD,
};

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

const initialize = (data: InitializeMessagePayload) => {
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
  });
};

// Add function to create bubble particles
const createBubbleParticles = (
  x: number,
  y: number,
  color: string,
  currentTime: number,
  count: number = 5
) => {
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
      createdAt: currentTime,
      lifetime: BUBBLE_PARTICLE_LIFETIME, // 300ms lifetime
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
          revealThreshold: 0.97 + Math.random() * 0.02, // Between 0.97 and 0.99
          reachedTarget: false,
          emittedBubbles: false,
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

  // Update and render bubble particles
  for (let i = workerState.bubbleParticles.length - 1; i >= 0; i--) {
    const bubble = workerState.bubbleParticles[i];

    // Update bubble position
    bubble.x += bubble.dx;
    bubble.y += bubble.dy;

    // Apply gentle wind effect
    bubble.dx += (Math.random() - 0.5) * 0.1;
    bubble.dy -= 0.02; // Slight upward drift

    // Calculate age based on animation time
    const age = requestAnimationFrameTime - bubble.createdAt;
    const lifeRatio = Math.min(1, age / bubble.lifetime);
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
    if (age >= bubble.lifetime) {
      workerState.bubbleParticles.splice(i, 1);
    }
  }

  // Reset alpha for particle rendering
  workerState.frameContext!.globalAlpha = 1;


  workerState.workerParticles.forEach((particle) => {
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

    if (blendFactor > 0 && blendFactor < 1) {
      // Blending mode: draw both circle and image with appropriate opacities
      const radius = Math.floor(
        workerState.appProps.particleRadius * (particle.scale || 1)
      );

      // Draw circle with reduced opacity
      workerState.frameContext!.globalAlpha = (particle.opacity || 1) * (1 - blendFactor);
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
      workerState.frameContext!.globalAlpha = blendFactor;
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
      const radius = Math.floor(
        workerState.appProps.particleRadius * (particle.scale || 1)
      );

      workerState.frameContext!.globalAlpha = particle.opacity || 1;
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

    if (!particle.emittedBubbles && workerState.appProps.enableBubbles && particle.x === particle.targetX && particle.y === particle.targetY) {
      particle.emittedBubbles = true;
      const bubbles = createBubbleParticles(
        particle.x,
        particle.y,
        particle.color,
        requestAnimationFrameTime,
        2 + Math.floor(Math.random() * 3)
      );
      workerState.bubbleParticles.push(...bubbles);
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

  const totalAnimationTime = workerState.appProps.animationDuration + (workerState.appProps.enableBubbles ? BUBBLE_PARTICLE_LIFETIME : 0);
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
      // Clear any remaining bubbles
      workerState.bubbleParticles = [];
      workerState.frameContext!.drawImage(workerState.imageBitmap!, 0, 0);

      // Send animation complete message to main thread
      self.postMessage({
        type: WorkerAction.ANIMATION_COMPLETE,
      });
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
  workerState.workerParticles.forEach((particle) => {
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
      console.log('worker initializing')
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
    case Action.UPDATE_PARTICLE_SPREAD: {
      workerState.appProps.particleSpread = payload;

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
