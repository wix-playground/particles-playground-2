import {DEV_EXAMPLE_CODE} from './constants';

const linearMovementFunctionString = `return (particle, animationStartTime, currentTime) => {
    const calculateDistance = (point1, point2) => {
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const lerp = (start, end, t) =>
        start + t * (end - start);

    const targetCoordinates = { x: particle.targetX, y: particle.targetY };
    const distance = calculateDistance(
        { x: particle.x, y: particle.y },
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
`;

const bezierMovementFunctionString = `return (particle, animationStartTime, currentTime) => {
    const targetCoordinates = { x: particle.targetX, y: particle.targetY };

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
            2 * (1 - t) * t * particle.controlX +
            Math.pow(t, 2) * targetCoordinates.x;
        particle.y =
            Math.pow(1 - t, 2) * startY +
            2 * (1 - t) * t * particle.controlY +
            Math.pow(t, 2) * targetCoordinates.y;
    } else {
        particle.x = targetCoordinates.x;
        particle.y = targetCoordinates.y;
        particle.t = 0;
    }
};`;

const easingBackInFunctionString = `return (particle, animationStartTime, currentTime) => {
    const animationDuration = 2000;
    // This is obviously inefficient because the same constant will be recalculated for every particle, but this is a playground and its not that expensive.
    /**
     * Back-in easing function.
     * @param {number} t - The time value (between 0 and 1).
     * @returns The eased value.
     */
    const backIn = (t) => 2.70158 * t ** 3 - 1.70158 * t ** 2;
    const lerp = (start, end, t) => start + t * (end - start);

    const totalElapsedTime = currentTime - animationStartTime;
    const progress = Math.min(totalElapsedTime / animationDuration, 1);
    const easedProgress = backIn(progress);
    particle.x = lerp(particle.initialX, particle.targetX, easedProgress);
    particle.y = lerp(particle.initialY, particle.targetY, easedProgress);

    if (
        Math.abs(particle.x - particle.targetX) < 0.8 &&
        Math.abs(particle.y - particle.targetY) < 0.8
    ) {
        particle.x = particle.targetX;
        particle.y = particle.targetY;
    }
};`;

export const getPredefinedMovementOptions: () => {
  [functionName: string]: string;
} = () => ({
  linear: linearMovementFunctionString,
  bezier: bezierMovementFunctionString,
  easingBackIn: easingBackInFunctionString,
  DEV_TWO_FRAMES: DEV_EXAMPLE_CODE,
});
