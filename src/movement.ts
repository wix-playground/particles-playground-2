import {Particle} from './interfaces';
import {calculateDistance, lerp} from './utils';

// Example function of how particle position is updated
const applySimpleExampleMovement = (particle: Particle) => {
  // Every time this function is called, particle coordinates will change by DELTA
  const DELTA = 2;

  // Snap particle to target coordinate if distance is less than SNAP_THRESHOLD
  const SNAP_THRESHOLD = 5;

  // If distance from target is more than SNAP_THRESHOLD, move particle by delta. Else snap to target.

  // Check X coordinate:
  if (Math.abs(particle.x - particle.targetX) > SNAP_THRESHOLD) {
    const newX =
      particle.x < particle.targetX ? particle.x + DELTA : particle.x - DELTA;
    particle.x = newX;
  } else {
    particle.x = particle.targetX;
  }

  // Same for Y:
  if (Math.abs(particle.y - particle.targetY) > SNAP_THRESHOLD) {
    const newY =
      particle.y < particle.targetY ? particle.y + DELTA : particle.y - DELTA;
    particle.y = newY;
  } else {
    particle.y = particle.targetY;
  }
};

const applyLinearMovement = (particle: Particle) => {
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

const applyBezierMovement = (particle: Particle) => {
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

// Add your own movement functions here, they will appear on UI
export const movementConfig: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [movementFunction: string]: (...args: any[]) => void;
} = {
  simpleExample: applySimpleExampleMovement,
  linear: applyLinearMovement,
  bezier: applyBezierMovement,
};
