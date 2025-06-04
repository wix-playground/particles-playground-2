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
  DEFAULT_PARTICLE_SIZE_EASING,
  DEFAULT_PARTICLE_OPACITY_EASING,
  DEFAULT_DELAY,
  DEFAULT_EMITTER_X,
  DEFAULT_EMITTER_Y,
  DEFAULT_EMITTER_SIZE,
  DEFAULT_EMITTER_ANGLE,
  DEFAULT_ENABLE_REVEAL_ANIMATION,
  DEFAULT_REVEAL_DIRECTION,
  EFFECT_PARTICLE_MAX_LIFETIME,
  EFFECT_PARTICLE_MIN_LIFETIME,
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
  RevealDirection,
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
  particleSizeEasing: DEFAULT_PARTICLE_SIZE_EASING,
  particleOpacityEasing: DEFAULT_PARTICLE_OPACITY_EASING,
  delay: DEFAULT_DELAY,
  emitterX: DEFAULT_EMITTER_X,
  emitterY: DEFAULT_EMITTER_Y,
  emitterSize: DEFAULT_EMITTER_SIZE,
  emitterAngle: DEFAULT_EMITTER_ANGLE,
  enableRevealAnimation: DEFAULT_ENABLE_REVEAL_ANIMATION,
  revealDirection: DEFAULT_REVEAL_DIRECTION,
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
  effectParticles: EffectParticle[];
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
  effectParticles: [],
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
  startCoordinatesConfig = getStartCoordinatesConfig({
    dimensions,
    emitterX: workerState.appProps.emitterX,
    emitterY: workerState.appProps.emitterY,
    emitterSize: workerState.appProps.emitterSize,
    emitterAngle: workerState.appProps.emitterAngle,
  });

  workerState.workerParticles = generateParticles({
    validBlocks: workerState.validBlocks,
    radius: workerState.appProps.particleRadius,
    blockHeight: workerState.blockHeight,
    blockWidth: workerState.blockWidth,
    startPosition: workerState.appProps.startPosition,
    delay: workerState.appProps.delay,
    animationDuration: workerState.appProps.animationDuration,
    revealAnimation: workerState.appProps.enableRevealAnimation,
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
  animationDuration, revealAnimation
}: {
  validBlocks: Uint8Array<ArrayBuffer>;
  radius: number;
  blockHeight: number;
  blockWidth: number;
  startPosition: StartPositionType;
  delay: number;
  animationDuration: number;
  revealAnimation: boolean;
}) => {
  const particles: Array<Particle> = [];

  for (let blockY = 0; blockY < blockHeight; blockY++) {
    for (let blockX = 0; blockX < blockWidth; blockX++) {
      const index = blockY * blockWidth + blockX;
      if (validBlocks[index]) {
        const x = blockX * radius;
        const y = blockY * radius;

        const {x: initialX, y: initialY} = revealAnimation ? {x: x, y: y} : startCoordinatesConfig[startPosition as StartPositionType]();

        const particleDelay = revealAnimation ? 0 : Math.random() * delay;
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

// Function to calculate the actual text boundaries from particles
const getTextBoundaries = (particles: Particle[]): Dimensions & {minX: number; minY: number; maxX: number; maxY: number} => {
  if (particles.length === 0) {
    return {width: 0, height: 0, minX: 0, minY: 0, maxX: 0, maxY: 0};
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  particles.forEach(particle => {
    minX = Math.min(minX, particle.targetX);
    minY = Math.min(minY, particle.targetY);
    maxX = Math.max(maxX, particle.targetX + workerState.appProps.particleRadius);
    maxY = Math.max(maxY, particle.targetY + workerState.appProps.particleRadius);
  });

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

// Function to determine if a particle should be revealed based on reveal progress and direction
const shouldParticleBeRevealed = (
  particle: Particle,
  revealProgress: number,
  revealDirection: RevealDirection,
  textBoundaries: ReturnType<typeof getTextBoundaries>
): boolean => {
  switch (revealDirection) {
    case 'left-to-right': {
      const revealXPosition = textBoundaries.minX + (revealProgress * textBoundaries.width);
      return particle.targetX <= revealXPosition;
    }
    case 'right-to-left': {
      const revealXPosition = textBoundaries.maxX - (revealProgress * textBoundaries.width);
      return particle.targetX >= revealXPosition;
    }
    case 'top-to-bottom': {
      const revealYPosition = textBoundaries.minY + (revealProgress * textBoundaries.height);
      return particle.targetY <= revealYPosition;
    }
    case 'bottom-to-top': {
      const revealYPosition = textBoundaries.maxY - (revealProgress * textBoundaries.height);
      return particle.targetY >= revealYPosition;
    }
    default:
      return true; // fallback
  }
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
  const startOpacity = workerState.appProps.startParticleOpacity;
  const endOpacity = workerState.appProps.endParticleOpacity;

  // Get the easing multiplier based on the selected pattern
  const easingMultiplier = getParticleOpacityEasingMultiplier(
    particleProgress,
    workerState.appProps.particleOpacityEasing
  );

  if (workerState.appProps.particleOpacityEasing !== 'linear') {
    const baseOpacity = Math.min(startOpacity, endOpacity);
    const maxOpacity = Math.max(startOpacity, endOpacity);
    return baseOpacity + (maxOpacity - baseOpacity) * easingMultiplier;
  }
  return startOpacity + (endOpacity - startOpacity) * easingMultiplier;
};

// Custom easing functions for particle opacity
const getParticleOpacityEasingMultiplier = (progress: number, easingType: string): number => {
  switch (easingType) {
    case 'bell':
      // Bell curve: starts low, peaks in middle, ends low
      // Using a sin function shifted to create a bell shape
      return Math.sin(progress * Math.PI);

    case 'linear':
      return progress;

    case 'multiPulse':
      // Multiple pulses: creates 5 pulses over the lifetime
      const pulseCount = 5;
      const pulseProgress = (progress * pulseCount) % 1;

      return Math.sin(pulseProgress * Math.PI);

    default:
      return 1; // fallback to constant opacity
  }
};

// Custom easing functions based on the patterns in the image
const getParticleSizeEasingMultiplier = (progress: number, easingType: string): number => {
  switch (easingType) {
    case 'bell':
      // Bell curve: starts low, peaks in middle, ends low
      // Using a sin function shifted to create a bell shape
      return Math.sin(progress * Math.PI);

    case 'linear':
      return progress;

    case 'multiPulse':
      // Multiple pulses: creates 5 pulses over the lifetime
      const pulseCount = 5;
      const pulseProgress = (progress * pulseCount) % 1;

      return Math.sin(pulseProgress * Math.PI);

    default:
      return 1; // fallback to constant size
  }
};

// Add function to calculate current particle size based on animation progress
const getCurrentParticleSize = (particleProgress: number): number => {
  const startSize = workerState.appProps.startParticleSize;
  const endSize = workerState.appProps.endParticleSize;

  // Get the easing multiplier based on the selected pattern
  const easingMultiplier = getParticleSizeEasingMultiplier(
    particleProgress,
    workerState.appProps.particleSizeEasing
  );

  if (workerState.appProps.particleSizeEasing !== 'linear') {
    const baseSize = Math.min(startSize, endSize);
    const maxSize = Math.max(startSize, endSize);
    return baseSize + (maxSize - baseSize) * easingMultiplier;
  }
  return startSize + (endSize - startSize) * easingMultiplier;
};

// Add interface for effect particles at the top after other interfaces
interface EffectParticle {
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  startTime: number;
  lifetime: number;
  size: number;
  opacity: number;
  color: string;
}

const renderRevealAnimation = (
  animationStartTime: number,
  requestAnimationFrameTime: number,
  textBoundaries: ReturnType<typeof getTextBoundaries>
) => {
  workerState.frameContext!.clearRect(
    0,
    0,
    workerState.frameCanvas!.width,
    workerState.frameCanvas!.height
  );

  const elapsedTime = requestAnimationFrameTime - animationStartTime;
  const textRevealDuration = workerState.appProps.animationDuration - EFFECT_PARTICLE_MAX_LIFETIME;
  workerState.revealProgress = Math.min(
    1,
    elapsedTime / workerState.appProps.animationDuration
  );

  const textRevealProgress = Math.min(
    1,
    elapsedTime / textRevealDuration
  );

  // Reset alpha for particle rendering
  workerState.frameContext!.globalAlpha = 1;

  workerState.workerParticles.forEach((particle, index) => {
    // Check if particle should be revealed
    const shouldReveal = shouldParticleBeRevealed(
      particle,
      textRevealProgress,
      workerState.appProps.revealDirection,
      textBoundaries
    );

    if (!shouldReveal) {
      return;
    }

    // Check if this particle was just revealed (spawn effect particles)
    if (!particle.emittedBubbles) {
      particle.emittedBubbles = true;

      // Only spawn effect particles for every other particle (even indices)
      if (index % 2 === 0) {
        // Spawn effect particles from this position
        const numEffectParticles = 3 + Math.floor(Math.random() * 3); // 3-5 particles

        for (let i = 0; i < numEffectParticles; i++) {
          // Calculate base direction based on reveal direction
          let baseVx = 0, baseVy = 0;
          const speed = 0.5 + Math.random() * 1; // Base speed

          switch (workerState.appProps.revealDirection) {
            case 'left-to-right':
              baseVx = speed;
              baseVy = 0;
              break;
            case 'right-to-left':
              baseVx = -speed;
              baseVy = 0;
              break;
            case 'top-to-bottom':
              baseVx = 0;
              baseVy = speed;
              break;
            case 'bottom-to-top':
              baseVx = 0;
              baseVy = -speed;
              break;
          }

          // Add turbulence
          const turbulence = 0.8;
          const vx = baseVx + (Math.random() - 0.5) * turbulence;
          const vy = baseVy + (Math.random() - 0.5) * turbulence;

          workerState.effectParticles.push({
            x: particle.x + workerState.appProps.particleRadius / 2,
            y: particle.y + workerState.appProps.particleRadius / 2,
            vx,
            vy,
            startTime: requestAnimationFrameTime,
            lifetime: EFFECT_PARTICLE_MIN_LIFETIME + Math.random() * (EFFECT_PARTICLE_MAX_LIFETIME - EFFECT_PARTICLE_MIN_LIFETIME),
            size: workerState.appProps.particleRadius * (0.3 + Math.random() * 0.4), // 30-70% of particle radius
            opacity: 1,
            color: workerState.appProps.particleColors.length
              ? getColorFromProgress(workerState.appProps.particleColors, Math.random())
              : DEFAULT_PARTICLE_COLOR,
          });
        }
      }
    }

    // Draw the revealed particle
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
  });

  // Update and render effect particles
  for (let i = workerState.effectParticles.length - 1; i >= 0; i--) {
    const effectParticle = workerState.effectParticles[i];
    const particleAge = requestAnimationFrameTime - effectParticle.startTime;
    const progress = Math.min(1, particleAge / effectParticle.lifetime);

    // Remove expired particles
    if (progress >= 1) {
      workerState.effectParticles.splice(i, 1);
      continue;
    }

    // Update position
    effectParticle.x += effectParticle.vx;
    effectParticle.y += effectParticle.vy;

    // Apply slight deceleration
    effectParticle.vx *= 0.99;
    effectParticle.vy *= 0.99;

    // Calculate current opacity and size based on progress and app props (same as regular particles)
    const currentOpacity = getCurrentParticleOpacity(progress);
    const currentSize = getCurrentParticleSize(progress);
    const radius = effectParticle.size * currentSize;

    // Use color progression similar to regular particles
    const particleColor = workerState.appProps.particleColors.length
      ? getColorFromProgress(workerState.appProps.particleColors, progress)
      : effectParticle.color;

    // Draw effect particle (same pattern as regular circle particles)
    workerState.frameContext!.globalAlpha = currentOpacity;
    workerState.frameContext!.beginPath();
    workerState.frameContext!.arc(
      Math.floor(effectParticle.x),
      Math.floor(effectParticle.y),
      radius / 2,
      0,
      2 * Math.PI
    );
    workerState.frameContext!.fillStyle = particleColor;
    workerState.frameContext!.fill();
  }

  // Reset alpha
  workerState.frameContext!.globalAlpha = 1;

  const frameBitmap = workerState.frameCanvas!.transferToImageBitmap();
  workerState.mainContext!.transferFromImageBitmap(frameBitmap);

  if (workerState.revealProgress < 1) {
    workerState.animationFrameId = requestAnimationFrame(
      (requestAnimationFrameTime) =>
        renderRevealAnimation(animationStartTime, requestAnimationFrameTime, textBoundaries)
    );
  } else {
    // Reveal complete - draw final image
    workerState.frameContext!.drawImage(workerState.imageBitmap!, 0, 0);
    const finalBitmap = workerState.frameCanvas!.transferToImageBitmap();
    workerState.mainContext!.transferFromImageBitmap(finalBitmap);

    // Clear effect particles
    workerState.effectParticles = [];

    // Send animation complete message to main thread
    self.postMessage({
      type: WorkerAction.ANIMATION_COMPLETE,
    });
  }
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
        workerState.appProps.particleRadius * (currentSize || 1);

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
        workerState.appProps.particleRadius * (currentSize || 1);

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
    elapsedTime >= totalAnimationTime;

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

  // Clear any existing effect particles
  workerState.effectParticles = [];

  customMovementFunction = new Function(
    workerState.appProps.movementFunctionCode
  )();
  const startTime = performance.now();
  workerState.revealProgress = 0;

  // Choose rendering function based on reveal animation setting
  if (workerState.appProps.enableRevealAnimation) {
    const textBoundaries = getTextBoundaries(workerState.workerParticles);
    workerState.frameContext!.globalAlpha = 1;
    renderRevealAnimation(startTime, startTime, textBoundaries);
  } else {
    renderParticles(startTime, startTime);
  }
};

const handleReset = () => {
  if (workerState.animationFrameId) {
    cancelAnimationFrame(workerState.animationFrameId);
  }

  // Clear effect particles
  workerState.effectParticles = [];

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
        reachedTarget: false,
        emittedBubbles: false,
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
};

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
      emitterX: workerState.appProps.emitterX,
      emitterY: workerState.appProps.emitterY,
      emitterSize: workerState.appProps.emitterSize,
      emitterAngle: workerState.appProps.emitterAngle,
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
      revealAnimation: workerState.appProps.enableRevealAnimation,
    });
  }
}

const handleUpdateAppProps = (payload: MessagePayloadMap[Action.UPDATE_APP_PROPS]) => {
  const {appProps, shouldUpdateStartCoordinatesConfig, shouldRegenerateImageBlocks} = payload;

  // Update the worker state with the new properties
  Object.assign(workerState.appProps, appProps);

  if (shouldRegenerateImageBlocks) {
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

  if (shouldUpdateStartCoordinatesConfig) {
    startCoordinatesConfig = getStartCoordinatesConfig({
      dimensions: {
        width: workerState.mainCanvas!.width,
        height: workerState.mainCanvas!.height,
      },
      emitterX: workerState.appProps.emitterX,
      emitterY: workerState.appProps.emitterY,
      emitterSize: workerState.appProps.emitterSize,
      emitterAngle: workerState.appProps.emitterAngle,
    });
  }

  workerState.workerParticles = generateParticles({
    validBlocks: workerState.validBlocks ?? new Uint8Array(),
    radius: workerState.appProps.particleRadius,
    blockHeight: workerState.blockHeight,
    blockWidth: workerState.blockWidth,
    startPosition: workerState.appProps.startPosition,
    delay: workerState.appProps.delay,
    animationDuration: workerState.appProps.animationDuration,
    revealAnimation: workerState.appProps.enableRevealAnimation,
  });

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
