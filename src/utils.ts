import {Coordinates, Particle} from './interfaces';

export const getValidImageBlocks = (
  imageData: ImageData,
  particleSize: number
) => {
  const OPACITY_THRESHOLD = 10;
  const {width, height, data} = imageData;
  const blockWidth = Math.ceil(width / particleSize);
  const blockHeight = Math.ceil(height / particleSize);
  const validBlocks = new Uint8Array(
    Math.ceil(width / particleSize) * Math.ceil(height / particleSize)
  );

  let index = 0;

  for (let y = 0; y < height; y += particleSize) {
    for (let x = 0; x < width; x += particleSize) {
      let isValid = false;
      for (let dy = 0; dy < particleSize && !isValid; dy++) {
        for (let dx = 0; dx < particleSize && !isValid; dx++) {
          const srcX = x + dx;
          const srcY = y + dy;
          if (srcX < width && srcY < height) {
            const srcIndex = (srcY * width + srcX) * 4;
            if (data[srcIndex + 3] > OPACITY_THRESHOLD) {
              isValid = true;
            }
          }
        }
      }
      validBlocks[index++] = isValid ? 1 : 0;
    }
  }
  return {validBlocks, blockWidth, blockHeight};
};

export const applyLinearMovement = (particle: Particle) => {
  const targetCoordinates = {x: particle.targetX, y: particle.targetY};
  // Calculate the distance to the target
  const distance = calculateDistance(
    {x: particle.x, y: particle.y},
    targetCoordinates
  );

  if (distance > 1) {
    // Use lerp for smooth movement
    const t = 0.05;
    particle.x = lerp(particle.x, targetCoordinates.x, t);
    particle.y = lerp(particle.y, targetCoordinates.y, t);
  } else {
    // Snap to target if very close
    particle.x = targetCoordinates.x;
    particle.y = targetCoordinates.y;
  }
};

export const applyBezierMovement = (particle: Particle) => {
  const targetCoordinates = {x: particle.targetX, y: particle.targetY};

  if (!particle.t) {
    particle.t = 0;
    particle.controlX =
      (particle.x + targetCoordinates.x) / 2 + (Math.random() - 0.5) * 100;
    particle.controlY =
      (particle.y + targetCoordinates.y) / 2 + (Math.random() - 0.5) * 100;
  }

  if (particle.t < 1) {
    particle.t += 0.01;
    const t = particle.t;
    const startX = particle.initialX || particle.x;
    const startY = particle.initialY || particle.y;

    particle.x =
      Math.pow(1 - t, 2) * startX +
      2 * (1 - t) * t * particle.controlX! +
      Math.pow(t, 2) * targetCoordinates.x;
    particle.y =
      Math.pow(1 - t, 2) * startY +
      2 * (1 - t) * t * particle.controlY! +
      Math.pow(t, 2) * targetCoordinates.y;
  } else {
    particle.x = targetCoordinates.x;
    particle.y = targetCoordinates.y;
    particle.t = 0;
  }
};

export const lerp = (start: number, end: number, t: number) =>
  start + t * (end - start);

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const calculateDistance = (point1: Coordinates, point2: Coordinates) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const getRandomInt = (min: number, max: number) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
};
