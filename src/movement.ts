import {
  DEFAULT_MOVEMENT_FUNCTION_KEY,
  DEV_EXAMPLE_CODE,
  EXAMPLE_CODE,
  EXAMPLE_JSDOC,
} from './constants';

const easingFunctions: {
  name: string;
  definition: string;
  comment: string;
}[] = [
    {
      name: 'linear',
      definition: 'const linear = (t) => t;',
      comment: `/**
    * Linear easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'sineIn',
      definition: 'const sineIn = (t) => 1 - Math.cos((t * Math.PI) / 2);',
      comment: `/**
    * Sine-in easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'sineOut',
      definition: 'const sineOut = (t) => Math.sin((t * Math.PI) / 2);',
      comment: `/**
    * Sine-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'sineInOut',
      definition: 'const sineInOut = (t) => -(Math.cos(Math.PI * t) - 1) / 2;',
      comment: `/**
    * Sine-in-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'quadIn',
      definition: 'const quadIn = (t) => t ** 2;',
      comment: `/**
    * Quadratic-in easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'quadOut',
      definition: 'const quadOut = (t) => 1 - (1 - t) ** 2;',
      comment: `/**
    * Quadratic-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'quadInOut',
      definition:
        'const quadInOut = (t) => t < 0.5 ? 2 * t ** 2 : 1 - (-2 * t + 2) ** 2 / 2;',
      comment: `/**
    * Quadratic-in-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'cubicIn',
      definition: 'const cubicIn = t => t ** 3;',
      comment: `/**
    * Cubic-in easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'cubicOut',
      definition: 'const cubicOut = t => 1 - (1 - t) ** 3;',
      comment: `/**
    * Cubic-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'cubicInOut',
      definition: `const cubicInOut = t => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);`,
      comment: `/**
    * Cubic-in-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'quartIn',
      definition: 'const quartIn = t => t ** 4;',
      comment: `/**
    * Quartic-in easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'quartOut',
      definition: 'const quartOut = t => 1 - (1 - t) ** 4;',
      comment: `/**
    * Quartic-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'quartInOut',
      definition:
        'const quartInOut = t => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);',
      comment: `/**
    * Quartic-in-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'quintIn',
      definition: 'const quintIn = t => t ** 5;',
      comment: `/**
    * Quintic-in easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'quintOut',
      definition: 'const quintOut = t => 1 - (1 - t) ** 5;',
      comment: `/**
    * Quintic-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'quintInOut',
      definition:
        'const quintInOut = t => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2);',
      comment: `/**
    * Quintic-in-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'expoIn',
      definition: 'const expoIn = t => (t === 0 ? 0 : 2 ** (10 * t - 10));',
      comment: `/**
    * Exponential-in easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'expoOut',
      definition: `const expoOut = t => (t === 1 ? 1 : 1 - 2 ** (-10 * t));`,
      comment: `/**
    * Exponential-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'expoInOut',
      definition: `const expoInOut = t =>
  t === 0
    ? 0
    : t === 1
    ? 1
    : t < 0.5
    ? 2 ** (20 * t - 10) / 2
    : (2 - 2 ** (-20 * t + 10)) / 2;`,
      comment: `/**
    * Exponential-in-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'circIn',
      definition: 'const circIn = t => 1 - Math.sqrt(1 - t ** 2);',
      comment: `/**
    * Circular-in easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'circOut',
      definition: 'const circOut = t => Math.sqrt(1 - (t - 1) ** 2);',
      comment: `/**
    * Circular-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'circInOut',
      definition: `const circInOut = t =>
  t < 0.5
    ? (1 - Math.sqrt(1 - 4 * t ** 2)) / 2
    : (Math.sqrt(-(2 * t - 3) * (2 * t - 1)) + 1) / 2;`,
      comment: `/**
    * Circular-in-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'backIn',
      definition: 'const backIn = t => 2.70158 * t ** 3 - 1.70158 * t ** 2;',
      comment: `/**
    * Back-in easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'backOut',
      definition:
        'const backOut = t => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;',
      comment: `/**
    * Back-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`,
    },
    {
      name: 'backInOut',
      definition: `const backInOut = (t, k = 1.70158 * 1.525) =>
      t < 0.5
        ? ((2 * t) ** 2 * ((k + 1) * 2 * t - k)) / 2
        : ((2 * t - 2) ** 2 * ((k + 1) * (t * 2 - 2) + k) + 2) / 2;`,
      comment: `/**
    * Back-in-out easing function.
    * @param t - The time value (between 0 and 1).
    * @param k - The back factor (optional, default is 1.70158 * 1.525).
    * @returns The eased value.
    */`,
    },
    {
      name: 'elasticIn',
      definition: ` const elasticIn = (x) => {
    const c4 = (2 * Math.PI) / 3;
    return x === 0
      ? 0
      : x === 1
      ? 1
      : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4)}`,
      comment: ``,
    },
    {
      name: 'elasticOut',
      definition: `const elasticOut = (x) =>{
    const c4 = (2 * Math.PI) / 3;

    return x === 0
      ? 0
      : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    }`,
      comment: ``,
    },
    {
      name: 'elasticInOut',
      definition: `const elasticInOut = (x) => {
    const c5 = (2 * Math.PI) / 4.5;

    return x === 0
      ? 0
      : x === 1
      ? 1
      : x < 0.5
      ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
      : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
    }`,
      comment: ``,
    },
  ];
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

export const getPredefinedMovementOptions: () => {
  [functionName: string]: {code: string; illustration?: React.ReactNode};
} = () =>
    Object.assign(
      {},
      {
        [DEFAULT_MOVEMENT_FUNCTION_KEY]: {code: `${EXAMPLE_JSDOC}${EXAMPLE_CODE}`},
        DEV_TWO_FRAMES: {code: `${EXAMPLE_JSDOC}${DEV_EXAMPLE_CODE}`},
        bezier: {code: `${EXAMPLE_JSDOC}${bezierMovementFunctionString}`},
      },
      ...easingFunctions.map(({name, comment, definition}) => ({
        [name]: {
          code: `${EXAMPLE_JSDOC}return (particle, animationStartTime, currentTime, canvasDimensions) => {
    const animationDuration = 2000;
    // This is obviously inefficient because the same constant will be recalculated for every particle, but this is a playground and its not that expensive.
    ${comment}
    ${definition}
    const lerp = (start, end, t) => start + t * (end - start);

    const totalElapsedTime = currentTime - animationStartTime;
    const progress = Math.min(totalElapsedTime / animationDuration, 1);
    const easedProgress = ${name}(progress);

    particle.x = lerp(particle.initialX, particle.targetX, easedProgress);
    particle.y = lerp(particle.initialY, particle.targetY, easedProgress);

    if (
        Math.abs(particle.x - particle.targetX) < 1 &&
        Math.abs(particle.y - particle.targetY) < 1
    ) {
        particle.x = particle.targetX;
        particle.y = particle.targetY;
    }
};`,
        },
      }))
    );
