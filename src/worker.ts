import {
  DEFAULT_PARTICLE_COLOR,
  DEFAULT_APP_PROPS,
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
  DrawableParticle,
  EffectParticle,
} from './interfaces';
import {getMovementFunction} from './movementFunctions';
import {
  getStartCoordinatesConfig,
  getValidImageBlocks,
  getColorFromProgress,
} from './utils';

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
  appProps: DEFAULT_APP_PROPS,
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
    workerState.appProps = {...DEFAULT_APP_PROPS, ...appProps};
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
          radius,
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
  // Convert degrees to radians for mathematical calculations
  const angleInRadians = (revealDirection * Math.PI) / 180;

  // Calculate the center of the text boundaries
  const centerX = textBoundaries.minX + textBoundaries.width / 2;
  const centerY = textBoundaries.minY + textBoundaries.height / 2;

  // Calculate particle position relative to center
  const particleCenterX = particle.targetX + workerState.appProps.particleRadius / 2;
  const particleCenterY = particle.targetY + workerState.appProps.particleRadius / 2;

  const relativeX = particleCenterX - centerX;
  const relativeY = particleCenterY - centerY;

  // Project the particle position onto the reveal direction vector
  const projectionDistance = relativeX * Math.cos(angleInRadians) + relativeY * Math.sin(angleInRadians);

  // Calculate the maximum projection distance in the text boundaries
  const maxProjectionDistance = Math.max(
    Math.abs(textBoundaries.width / 2 * Math.cos(angleInRadians)) + Math.abs(textBoundaries.height / 2 * Math.sin(angleInRadians)),
    Math.abs(textBoundaries.width / 2 * Math.cos(angleInRadians)) - Math.abs(textBoundaries.height / 2 * Math.sin(angleInRadians))
  );

  // Calculate the reveal threshold based on progress
  const revealThreshold = -maxProjectionDistance + (revealProgress * 2 * maxProjectionDistance);

  // Particle should be revealed if its projection distance is less than the threshold
  return projectionDistance <= revealThreshold;
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

// Helper function to draw a circle particle
const drawCircleParticle = (
  particle: DrawableParticle,
  progress: number,
  centerOffset: boolean = true
) => {
  // Calculate current size and opacity based on individual particle progress
  const currentOpacity = getCurrentParticleOpacity(progress);
  const currentSize = getCurrentParticleSize(progress);
  const radius = particle.radius * currentSize;

  // Calculate color based on color progress with fallback
  let particleColor: string;
  try {
    particleColor = workerState.appProps.particleColors.length
      ? getColorFromProgress(workerState.appProps.particleColors, progress)
      : particle.color;

    // Additional fallback if color is still undefined or invalid
    if (!particleColor || typeof particleColor !== 'string') {
      particleColor = DEFAULT_PARTICLE_COLOR;
    }
  } catch (error) {
    console.warn('Error getting particle color:', error);
    particleColor = DEFAULT_PARTICLE_COLOR;
  }

  // Calculate position
  const centerX = centerOffset ? Math.floor(particle.x) + radius / 2 : Math.floor(particle.x);
  const centerY = centerOffset ? Math.floor(particle.y) + radius / 2 : Math.floor(particle.y);

  // Draw the circle
  workerState.frameContext!.globalAlpha = currentOpacity;
  workerState.frameContext!.beginPath();
  workerState.frameContext!.arc(
    centerX,
    centerY,
    radius / 2,
    0,
    2 * Math.PI
  );
  workerState.frameContext!.fillStyle = particleColor;
  workerState.frameContext!.fill();
};

// Helper function to create effect particles when a particle is revealed
const createEffectParticles = (
  particle: Particle,
  requestAnimationFrameTime: number
): EffectParticle[] => {
  const effectParticles: EffectParticle[] = [];
  const range = workerState.appProps.maxEffectParticles - workerState.appProps.minEffectParticles;
  const numEffectParticles = workerState.appProps.minEffectParticles + Math.floor(Math.random() * (range + 1));
  const effectParticleProgress = 0;

  for (let i = 0; i < numEffectParticles; i++) {
    // Calculate base direction based on wind direction
    const windDirectionRadians = (workerState.appProps.windDirection * Math.PI) / 180;
    const speed = workerState.appProps.windSpeed * (0.5 + Math.random() * 1); // Base speed with random variation

    const baseVx = Math.cos(windDirectionRadians) * speed;
    const baseVy = Math.sin(windDirectionRadians) * speed;

    // Add turbulence
    const turbulence = workerState.appProps.turbulence;
    const vx = baseVx + (Math.random() - 0.5) * turbulence;
    const vy = baseVy + (Math.random() - 0.5) * turbulence;

    effectParticles.push({
      x: particle.x + workerState.appProps.particleRadius / 2,
      y: particle.y + workerState.appProps.particleRadius / 2,
      vx,
      vy,
      startTime: requestAnimationFrameTime,
      lifetime: EFFECT_PARTICLE_MIN_LIFETIME + Math.random() * (workerState.appProps.maxEffectParticleLifetime - EFFECT_PARTICLE_MIN_LIFETIME),
      radius: workerState.appProps.particleRadius,
      opacity: 1,
      progress: effectParticleProgress,
      color: (() => {
        try {
          return workerState.appProps.particleColors.length
            ? getColorFromProgress(workerState.appProps.particleColors, effectParticleProgress)
            : DEFAULT_PARTICLE_COLOR;
        } catch (error) {
          console.warn('Error getting effect particle color:', error);
          return DEFAULT_PARTICLE_COLOR;
        }
      })(),
    });
  }

  return effectParticles;
};

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
  const textRevealDuration = workerState.appProps.animationDuration - workerState.appProps.maxEffectParticleLifetime;
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
        // Create and add effect particles
        const newEffectParticles = createEffectParticles(particle, requestAnimationFrameTime);
        workerState.effectParticles.push(...newEffectParticles);
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
    effectParticle.progress = Math.min(1, particleAge / effectParticle.lifetime);

    // Remove expired particles
    if (effectParticle.progress >= 1) {
      workerState.effectParticles.splice(i, 1);
      continue;
    }

    // Update position
    effectParticle.x += effectParticle.vx;
    effectParticle.y += effectParticle.vy;

    // Apply slight deceleration
    effectParticle.vx *= 0.99;
    effectParticle.vy *= 0.99;

    // Draw effect particle using helper function
    drawCircleParticle(
      effectParticle,
      effectParticle.progress,
      false // effect particles don't need center offset
    );
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

    workerState.workerParticles.forEach((particle) => {
      particle.emittedBubbles = false;
    });

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
    const movementFunction = getMovementFunction(workerState.appProps.selectedMovementFunction);
    if (movementFunction) {
      const newPosition = movementFunction(
        {
          targetCoordinates: {x: particle.targetX, y: particle.targetY},
          initialCoordinates: {x: particle.initialX, y: particle.initialY},
          progress: workerState.revealProgress
        }
      );

      // Update particle position with the returned coordinates
      particle.x = newPosition.x;
      particle.y = newPosition.y;
    }

    const blendFactor = getTransitionBlendFactor(particle, workerState.revealProgress);
    const currentOpacity = getCurrentParticleOpacity(individualParticleProgress);
    const currentSize = getCurrentParticleSize(individualParticleProgress);

    if (blendFactor > 0 && blendFactor < 1) {
      // Blending mode: draw both circle and image with appropriate opacities


      drawCircleParticle(
        particle,
        individualParticleProgress,
        true, // regular particles need center offset
      );

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
      drawCircleParticle(
        particle,
        individualParticleProgress,
        true, // regular particles need center offset
      );
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

  const startTime = performance.now();
  workerState.revealProgress = 0;

  // Choose rendering function based on reveal animation setting
  if (workerState.appProps.enableRevealAnimation) {
    const textBoundaries = getTextBoundaries(workerState.workerParticles);
    workerState.frameContext!.globalAlpha = 1;
    workerState.workerParticles.forEach(particle => {
      particle.emittedBubbles = false;
    });
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
        radius: workerState.appProps.particleRadius,
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
