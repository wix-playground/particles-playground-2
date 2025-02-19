import {Particle} from './interfaces';
import {calculateDistance, lerp} from './utils';

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

export const movementConfig: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [movementFunction: string]: (...args: any[]) => void;
} = {
  linear: applyLinearMovement,
  bezier: applyBezierMovement,
};
