// Keeping this commented code for when we actually need to develop/update movement functions

// import {Particle} from './interfaces';
// import {calculateDistance, lerp} from './utils';
// const applyLinearMovement = (particle: Particle) => {
//   const targetCoordinates = {x: particle.targetX, y: particle.targetY};
//   // Calculate the distance to the target
//   const distance = calculateDistance(
//     {x: particle.x, y: particle.y},
//     targetCoordinates
//   );

//   if (distance > 1) {
//     // Use lerp for smooth movement
//     const t = 0.05;
//     particle.x = lerp(particle.x, targetCoordinates.x, t);
//     particle.y = lerp(particle.y, targetCoordinates.y, t);
//   } else {
//     // Snap to target if very close
//     particle.x = targetCoordinates.x;
//     particle.y = targetCoordinates.y;
//   }
// };

// const applyBezierMovement = (particle: Particle) => {
//   const targetCoordinates = {x: particle.targetX, y: particle.targetY};

//   if (!particle.t) {
//     particle.t = 0;
//     particle.controlX =
//       (particle.x + targetCoordinates.x) / 2 + (Math.random() - 0.5) * 100;
//     particle.controlY =
//       (particle.y + targetCoordinates.y) / 2 + (Math.random() - 0.5) * 100;
//   }

//   if (particle.t < 1) {
//     particle.t += 0.01;
//     const t = particle.t;
//     const startX = particle.initialX || particle.x;
//     const startY = particle.initialY || particle.y;

//     particle.x =
//       Math.pow(1 - t, 2) * startX +
//       2 * (1 - t) * t * particle.controlX! +
//       Math.pow(t, 2) * targetCoordinates.x;
//     particle.y =
//       Math.pow(1 - t, 2) * startY +
//       2 * (1 - t) * t * particle.controlY! +
//       Math.pow(t, 2) * targetCoordinates.y;
//   } else {
//     particle.x = targetCoordinates.x;
//     particle.y = targetCoordinates.y;
//     particle.t = 0;
//   }
// };

const linearMovementFunctionString = `return (particle) => {
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

const bezierMovementFunctionString = `return (particle) => {
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

export const getPredefinedMovementOptions: () => {
  [functionName: string]: string;
} = () => ({
  linear: linearMovementFunctionString,
  bezier: bezierMovementFunctionString,
});
