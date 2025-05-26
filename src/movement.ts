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
const bezierMovementFunctionString = `return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
    const totalElapsedTime = currentTime - animationStartTime;
    const progress = Math.min(totalElapsedTime / animationDuration, 1);

    // Cubic ease-in-out for smooth animation timing
    const t = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    // Initialize control points if not already set
    if (!particle.controlPoint1X) {
        const deltaX = particle.targetX - particle.initialX;
        const deltaY = particle.targetY - particle.initialY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Create control points for a natural curved path
        const midX = (particle.initialX + particle.targetX) / 2;
        const midY = (particle.initialY + particle.targetY) / 2;

        // Offset control points perpendicular to the direct path
        const perpX = -deltaY / distance;
        const perpY = deltaX / distance;

        // Control points create an arc - adjust curvature based on distance
        const curvature = Math.min(distance * 0.3, 150);

        particle.controlPoint1X = particle.initialX + deltaX * 0.3 + perpX * curvature;
        particle.controlPoint1Y = particle.initialY + deltaY * 0.3 + perpY * curvature;

        particle.controlPoint2X = particle.targetX - deltaX * 0.3 + perpX * curvature * 0.5;
        particle.controlPoint2Y = particle.targetY - deltaY * 0.3 + perpY * curvature * 0.5;
    }

    // Cubic Bézier curve calculation: B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
    const oneMinusT = 1 - t;
    const oneMinusT2 = oneMinusT * oneMinusT;
    const oneMinusT3 = oneMinusT2 * oneMinusT;
    const t2 = t * t;
    const t3 = t2 * t;

    particle.x = oneMinusT3 * particle.initialX +
                 3 * oneMinusT2 * t * particle.controlPoint1X +
                 3 * oneMinusT * t2 * particle.controlPoint2X +
                 t3 * particle.targetX;

    particle.y = oneMinusT3 * particle.initialY +
                 3 * oneMinusT2 * t * particle.controlPoint1Y +
                 3 * oneMinusT * t2 * particle.controlPoint2Y +
                 t3 * particle.targetY;

    // Optional: Add rotation based on movement direction for enhanced visual effect
    if (progress > 0) {
        // Calculate tangent vector for rotation
        const tangentX = 3 * oneMinusT2 * (particle.controlPoint1X - particle.initialX) +
                        6 * oneMinusT * t * (particle.controlPoint2X - particle.controlPoint1X) +
                        3 * t2 * (particle.targetX - particle.controlPoint2X);

        const tangentY = 3 * oneMinusT2 * (particle.controlPoint1Y - particle.initialY) +
                        6 * oneMinusT * t * (particle.controlPoint2Y - particle.controlPoint1Y) +
                        3 * t2 * (particle.targetY - particle.controlPoint2Y);

        particle.rotation = Math.atan2(tangentY, tangentX);
    }

    // Scale effect - starts small, grows, then shrinks slightly at the end
    particle.scale = 0.5 + 0.7 * Math.sin(progress * Math.PI);

    // Opacity fades in and stays visible
    particle.opacity = Math.min(1, progress * 3);
};
`;

const pulseColorCycleMovementString = `return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
    const progress = Math.min((currentTime - animationStartTime) / animationDuration, 1);

    // Initialize properties if not set
    if (!particle.hasInit) {
        particle.hasInit = true;
        particle.originalScale = particle.scale;
        particle.hueOffset = Math.random() * 360; // Random starting hue
        particle.pulseFrequency = 3 + Math.random() * 2; // Individual pulse frequency
    }

    if (progress >= 1) {
        particle.x = particle.targetX;
        particle.y = particle.targetY;
    } else {
        // Direct path with slight delay at beginning
        const adjustedProgress = Math.pow(progress, 0.7);
        particle.x = particle.initialX + (particle.targetX - particle.initialX) * adjustedProgress;
        particle.y = particle.initialY + (particle.targetY - particle.initialY) * adjustedProgress;
    }

    // Dramatic scale pulsation - goes from very small to very large
    const pulseWave = Math.sin(progress * Math.PI * particle.pulseFrequency);

    // Scale gets extremely large at pulse peaks
    if (pulseWave > 0) {
        // Exponential scale increase on positive pulses
        particle.scale = particle.originalScale * (1 + Math.pow(pulseWave, 2) * 15);
    } else {
        // Become very small on negative pulses
        particle.scale = particle.originalScale * 0.2;
    }

    // End at normal scale
    if (progress > 0.9) {
        const finalAdjustment = (progress - 0.9) / 0.1;
        particle.scale = particle.scale * (1 - finalAdjustment) + particle.originalScale * finalAdjustment;
    }

    // Rapid color cycling through entire spectrum
    const hue = (particle.hueOffset + progress * 720) % 360; // 2 complete color cycles
    const saturation = 100; // Full saturation
    const lightness = 50 + 30 * pulseWave; // Brightness changes with pulse

    particle.color = \`hsl(\${hue}, \${saturation}%, \${lightness}%)\`;

    // Opacity pulses oppositely to scale
    particle.opacity = 0.4 + 0.6 * (1 - Math.abs(pulseWave));
}`;

const timeDistortionMovementString = `return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
    const progress = Math.min((currentTime - animationStartTime) / animationDuration, 1);

    // Initialize properties if not set
    if (!particle.hasInit) {
        particle.hasInit = true;
        particle.originalScale = particle.scale;
        particle.timeDialation = 0.3 + Math.random() * 1.4; // How fast/slow time moves for this particle
        particle.temporalPhase = Math.random() * Math.PI * 2; // Phase in time wave
        particle.chronoField = Math.random() * 0.8; // Strength of temporal field
        particle.timeReversal = Math.random() > 0.8; // 20% chance of time reversal
        particle.quantumFluctuation = Math.random() * 0.5; // Quantum time uncertainty
        particle.lastPosition = {x: particle.initialX, y: particle.initialY};
        particle.timeEcho = []; // Trail of previous positions
        particle.maxEchos = 5 + Math.floor(Math.random() * 5);
    }

    // Apply time dilation to progress
    let temporalProgress = progress;
    if (particle.timeReversal && progress > 0.3 && progress < 0.8) {
        // Time reversal in middle section, but still progress overall
        const reversalStrength = Math.sin((progress - 0.3) / 0.5 * Math.PI);
        const baseProgress = Math.pow(progress, 1 / particle.timeDialation);
        temporalProgress = baseProgress * (1 - reversalStrength * 0.6);
    } else {
        temporalProgress = Math.pow(progress, 1 / particle.timeDialation);
    }

    // Add temporal fluctuations
    const timeWave = Math.sin(progress * Math.PI * 4 + particle.temporalPhase);
    const fluctuation = timeWave * particle.quantumFluctuation * 0.2;
    temporalProgress = Math.max(0, Math.min(1, temporalProgress + fluctuation));

    if (progress >= 1) {
        particle.x = particle.targetX;
        particle.y = particle.targetY;
        particle.scale = particle.originalScale;
        particle.opacity = 1;
    } else {
        // Calculate position based on temporal progress
        let timeX = particle.initialX + (particle.targetX - particle.initialX) * temporalProgress;
        let timeY = particle.initialY + (particle.targetY - particle.initialY) * temporalProgress;

        // Add chronofield distortion - space-time curvature
        const fieldStrength = particle.chronoField * (1 - Math.abs(progress - 0.5) * 2);
        const distortionAngle = progress * Math.PI * 6 + particle.temporalPhase;
        const distortion = Math.sin(distortionAngle) * fieldStrength * 15;

        timeX += distortion;
        timeY += Math.cos(distortionAngle) * distortion * 0.7;

        // Store position in time echo trail
        if (particle.timeEcho.length >= particle.maxEchos) {
            particle.timeEcho.shift(); // Remove oldest echo
        }
        particle.timeEcho.push({x: particle.x || timeX, y: particle.y || timeY, opacity: 1});

        particle.x = timeX;
        particle.y = timeY;

        // Temporal scaling - particles stretch through time
        const timeStretch = 1 + Math.abs(timeWave) * particle.chronoField * 0.5;
        const dialationScale = 1 + (particle.timeDialation - 1) * 0.3 * (1 - progress);
        particle.scale = particle.originalScale * timeStretch * dialationScale;

        // Opacity flickers due to temporal uncertainty
        const uncertainty = Math.sin(progress * Math.PI * 12) * particle.quantumFluctuation;
        particle.opacity = 0.6 + 0.4 * temporalProgress + uncertainty * 0.2;

        // Time reversal creates ghostly effect during reversal phase
        if (particle.timeReversal && progress > 0.3 && progress < 0.8) {
            const reversalStrength = Math.sin((progress - 0.3) / 0.5 * Math.PI);
            particle.opacity *= (1 - reversalStrength * 0.3); // More transparent during reversal
        }
    }

    // Color represents temporal state
    let hue, saturation, lightness;

    if (particle.timeReversal && progress > 0.3 && progress < 0.8) {
        // Time reversal - purple/violet spectrum during reversal phase
        const reversalStrength = Math.sin((progress - 0.3) / 0.5 * Math.PI);
        hue = 280 + temporalProgress * 40;
        saturation = 70 + particle.chronoField * 30 + reversalStrength * 20;
        lightness = 30 + temporalProgress * 50;
    } else if (particle.timeDialation > 1) {
        // Fast time - blue spectrum (blue shift)
        hue = 240 - temporalProgress * 60; // Blue to cyan
        saturation = 80 + particle.timeDialation * 20;
        lightness = 40 + temporalProgress * 40;
    } else {
        // Slow time - red spectrum (red shift)
        hue = 0 + temporalProgress * 60; // Red to yellow
        saturation = 70 + (1 - particle.timeDialation) * 30;
        lightness = 35 + temporalProgress * 45;
    }

    // Add temporal shimmer
    const shimmer = Math.sin(progress * Math.PI * 8 + particle.temporalPhase) * 15;
    lightness = Math.max(0, Math.min(100, lightness + shimmer * particle.chronoField));

    particle.color = \`hsl(\${hue}, \${saturation}%, \${lightness}%)\`;
}`;

export const getPredefinedMovementOptions: () => {
  [functionName: string]: {code: string; illustration?: React.ReactNode};
} = () =>
    Object.assign(
      {},
      {
        [DEFAULT_MOVEMENT_FUNCTION_KEY]: {code: `${EXAMPLE_JSDOC}${EXAMPLE_CODE}`},
        DEV_TWO_FRAMES: {code: `${EXAMPLE_JSDOC}${DEV_EXAMPLE_CODE}`},
        bezier: {code: `${EXAMPLE_JSDOC}${bezierMovementFunctionString}`},
        pulseColorCycle: {code: `${EXAMPLE_JSDOC}${pulseColorCycleMovementString}`},
        timeDistortion: {code: `${EXAMPLE_JSDOC}${timeDistortionMovementString}`},
      },
      ...easingFunctions.map(({name, comment, definition}) => ({
        [name]: {
          code: `${EXAMPLE_JSDOC}return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
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
