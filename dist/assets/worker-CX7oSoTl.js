(function(){"use strict";const w="linear",L="linear",F="random",E="backInOut",U=`WIX 🤠
Particles!`,k="#ffffff",B=["#ff0000","#00ff00","#0000ff"],N="left-to-right",q={fontFamily:"Arial",fontSize:64,italic:!1,weight:600},H=`// This function will be called twice for each particle, because all particles reach the target in two frames.
return (particle, animationStartTime, currentTime, canvasDimensions) => {
    if (particle.x === 0 && particle.y === 0) {
        particle.x = particle.targetX;
        particle.y = particle.targetY;
    } else {
        particle.x = 0
        particle.y = 0
    }
}`,f=`/**
 * Define an animation function for moving a particle towards its target coordinates.
 *
 * @param {Object} particle - The particle object to be animated.
 * @param {number} particle.x - The current x-coordinate of the particle.
 * @param {number} particle.y - The current y-coordinate of the particle.
 * @param {number} particle.initialX - The initial x-coordinate for the particle.
 * @param {number} particle.initialY - The initial y-coordinate for the particle.
 * @param {number} particle.targetX - The target x-coordinate for the particle.
 * @param {number} particle.targetY - The target y-coordinate for the particle.
 * @param {number} particle.scale - The scale of the particle.
 * @param {number} particle.opacity - The opacity of the particle.
 * @param {string} particle.color - The color of the particle.
 * @param {number} animationStartTime - The timestamp when the animation started.
 * @param {number} currentTime - The current timestamp of the animation frame.
 * @param {Object} canvasDimensions - The dimensions of the canvas.
 * @param {number} canvasDimensions.width - Width of the canvas where particles are being rendered.
 * @param {number} canvasDimensions.height - Height of the canvas where particles are being rendered.
 * @param {number} animationDuration - The duration of the animation.
 * @returns {Function} A function to be called on each animation frame to update the particle's position.
 */
`,W=`${f}
return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
    /**
    * Write your movement animation code here to incrementally update particle position.
    * The particle is mutable here so you can add whatever properties you need to achieve your animation.
    */

    // Helper function for getting new position value.
    const getUpdatedPosition = (currentPosition, targetPosition, delta) => {
        const distance = Math.abs(currentPosition - targetPosition)
        if (distance <= delta) {
            return targetPosition
        } else {
            return currentPosition < targetPosition ? currentPosition + delta : currentPosition - delta
        }
    }

    // Elapsed time since the start of the animation.
    const totalElapsedTime = currentTime - animationStartTime

    const initialDelta = 1
    // After 1 second, the particles will move twice as fast.
    const delta = totalElapsedTime < 1000 ? initialDelta : initialDelta * 2

    // To keep the example simple, particle coordinates are updated by delta until target coordinates are reached.
    particle.x = getUpdatedPosition(particle.x, particle.targetX, delta)
    particle.y = getUpdatedPosition(particle.y, particle.targetY, delta)
}`,$=500,z=300,j=100,Z=0;var T=(e=>(e.INITIALIZE="INITIALIZE",e.PLAY="PLAY",e.RESET="RESET",e.UPDATE_APP_PROPS="UPDATE_APP_PROPS",e.UPDATE_BITMAP="UPDATE_BITMAP",e.RESIZE_PARTICLE_RADIUS="RESIZE_PARTICLE_RADIUS",e.UPDATE_START_POSITION="UPDATE_START_POSITION",e.UPDATE_SELECTED_MOVEMENT_FUNCTION="UPDATE_SELECTED_MOVEMENT_FUNCTION",e.UPDATE_TEXT="UPDATE_TEXT",e.UPDATE_FONT="UPDATE_FONT",e.UPDATE_PARTICLE_COLORS="UPDATE_PARTICLE_COLORS",e.UPDATE_ANIMATION_DURATION="UPDATE_ANIMATION_DURATION",e.UPDATE_PARTICLE_SPREAD="UPDATE_PARTICLE_SPREAD",e.UPDATE_START_PARTICLE_OPACITY="UPDATE_START_PARTICLE_OPACITY",e.UPDATE_END_PARTICLE_OPACITY="UPDATE_END_PARTICLE_OPACITY",e.UPDATE_START_PARTICLE_SIZE="UPDATE_START_PARTICLE_SIZE",e.UPDATE_END_PARTICLE_SIZE="UPDATE_END_PARTICLE_SIZE",e.UPDATE_DELAY="UPDATE_DELAY",e.UPDATE_REVEAL_ANIMATION="UPDATE_REVEAL_ANIMATION",e))(T||{}),P=(e=>(e.INITIALIZED="INITIALIZED",e.UPDATE_APP_PROPS="UPDATE_APP_PROPS",e.ANIMATION_COMPLETE="ANIMATION_COMPLETE",e))(P||{});const V=[{name:"linear",definition:"const linear = (t) => t;",comment:`/**
    * Linear easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"sineIn",definition:"const sineIn = (t) => 1 - Math.cos((t * Math.PI) / 2);",comment:`/**
    * Sine-in easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"sineOut",definition:"const sineOut = (t) => Math.sin((t * Math.PI) / 2);",comment:`/**
    * Sine-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"sineInOut",definition:"const sineInOut = (t) => -(Math.cos(Math.PI * t) - 1) / 2;",comment:`/**
    * Sine-in-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"quadIn",definition:"const quadIn = (t) => t ** 2;",comment:`/**
    * Quadratic-in easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"quadOut",definition:"const quadOut = (t) => 1 - (1 - t) ** 2;",comment:`/**
    * Quadratic-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"quadInOut",definition:"const quadInOut = (t) => t < 0.5 ? 2 * t ** 2 : 1 - (-2 * t + 2) ** 2 / 2;",comment:`/**
    * Quadratic-in-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"cubicIn",definition:"const cubicIn = t => t ** 3;",comment:`/**
    * Cubic-in easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"cubicOut",definition:"const cubicOut = t => 1 - (1 - t) ** 3;",comment:`/**
    * Cubic-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"cubicInOut",definition:"const cubicInOut = t => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);",comment:`/**
    * Cubic-in-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"quartIn",definition:"const quartIn = t => t ** 4;",comment:`/**
    * Quartic-in easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"quartOut",definition:"const quartOut = t => 1 - (1 - t) ** 4;",comment:`/**
    * Quartic-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"quartInOut",definition:"const quartInOut = t => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);",comment:`/**
    * Quartic-in-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"quintIn",definition:"const quintIn = t => t ** 5;",comment:`/**
    * Quintic-in easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"quintOut",definition:"const quintOut = t => 1 - (1 - t) ** 5;",comment:`/**
    * Quintic-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"quintInOut",definition:"const quintInOut = t => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2);",comment:`/**
    * Quintic-in-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"expoIn",definition:"const expoIn = t => (t === 0 ? 0 : 2 ** (10 * t - 10));",comment:`/**
    * Exponential-in easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"expoOut",definition:"const expoOut = t => (t === 1 ? 1 : 1 - 2 ** (-10 * t));",comment:`/**
    * Exponential-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"expoInOut",definition:`const expoInOut = t =>
  t === 0
    ? 0
    : t === 1
    ? 1
    : t < 0.5
    ? 2 ** (20 * t - 10) / 2
    : (2 - 2 ** (-20 * t + 10)) / 2;`,comment:`/**
    * Exponential-in-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"circIn",definition:"const circIn = t => 1 - Math.sqrt(1 - t ** 2);",comment:`/**
    * Circular-in easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"circOut",definition:"const circOut = t => Math.sqrt(1 - (t - 1) ** 2);",comment:`/**
    * Circular-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"circInOut",definition:`const circInOut = t =>
  t < 0.5
    ? (1 - Math.sqrt(1 - 4 * t ** 2)) / 2
    : (Math.sqrt(-(2 * t - 3) * (2 * t - 1)) + 1) / 2;`,comment:`/**
    * Circular-in-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"backIn",definition:"const backIn = t => 2.70158 * t ** 3 - 1.70158 * t ** 2;",comment:`/**
    * Back-in easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"backOut",definition:"const backOut = t => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;",comment:`/**
    * Back-out easing function.
    * @param t - The time value (between 0 and 1).
    * @returns The eased value.
    */`},{name:"backInOut",definition:`const backInOut = (t, k = 1.70158 * 1.525) =>
      t < 0.5
        ? ((2 * t) ** 2 * ((k + 1) * 2 * t - k)) / 2
        : ((2 * t - 2) ** 2 * ((k + 1) * (t * 2 - 2) + k) + 2) / 2;`,comment:`/**
    * Back-in-out easing function.
    * @param t - The time value (between 0 and 1).
    * @param k - The back factor (optional, default is 1.70158 * 1.525).
    * @returns The eased value.
    */`},{name:"elasticIn",definition:` const elasticIn = (x) => {
    const c4 = (2 * Math.PI) / 3;
    return x === 0
      ? 0
      : x === 1
      ? 1
      : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4)}`,comment:""},{name:"elasticOut",definition:`const elasticOut = (x) =>{
    const c4 = (2 * Math.PI) / 3;

    return x === 0
      ? 0
      : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    }`,comment:""},{name:"elasticInOut",definition:`const elasticInOut = (x) => {
    const c5 = (2 * Math.PI) / 4.5;

    return x === 0
      ? 0
      : x === 1
      ? 1
      : x < 0.5
      ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
      : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
    }`,comment:""}],Q=`return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
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
`,K=`return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
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
}`,G=`return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
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
}`,J=`return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
    const progress = Math.min((currentTime - animationStartTime) / animationDuration, 1);

    // Initialize elastic properties
    if (!particle.hasInit) {
        particle.hasInit = true;
        particle.elasticity = 0.6 + Math.random() * 0.3; // Bounce factor
        particle.damping = 0.95 + Math.random() * 0.04; // Energy loss per bounce
        particle.bounceCount = 0;
        particle.originalScale = particle.scale;
        particle.lastUpdateTime = animationStartTime;

        // Calculate initial velocity toward target (pixels per second)
        const dx = particle.targetX - particle.initialX;
        const dy = particle.targetY - particle.initialY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        particle.velocityX = (dx / distance) * 480; // pixels per second
        particle.velocityY = (dy / distance) * 480; // pixels per second

        // Create invisible barriers
        particle.barriers = [
            {x: particle.initialX + dx * 0.3, y: particle.initialY + dy * 0.3, normal: {x: 1, y: 0}},
            {x: particle.initialX + dx * 0.6, y: particle.initialY + dy * 0.6, normal: {x: 0, y: 1}},
            {x: particle.initialX + dx * 0.8, y: particle.initialY + dy * 0.8, normal: {x: -1, y: 1}}
        ];

        particle.currentX = particle.initialX;
        particle.currentY = particle.initialY;
        particle.bounceCooldown = {};
    }

    // Calculate actual deltaTime from the time parameters
    const deltaTime = (currentTime - particle.lastUpdateTime) / 1000; // Convert to seconds
    particle.lastUpdateTime = currentTime;

    if (progress < 0.95) {
        // Update position using actual deltaTime
        particle.currentX += particle.velocityX * deltaTime;
        particle.currentY += particle.velocityY * deltaTime;

        // Check for barrier collisions
        particle.barriers.forEach((barrier, index) => {
            const distanceToBarrier = Math.abs(
                (particle.currentX - barrier.x) * barrier.normal.x +
                (particle.currentY - barrier.y) * barrier.normal.y
            );

            // Use time-based bounce prevention instead of frame-based
            const bounceKey = \`bounce_\${index}\`;
            const cooldownDuration = 50; // 50ms cooldown

            if (distanceToBarrier < 15 && (!particle.bounceCooldown[bounceKey] || currentTime - particle.bounceCooldown[bounceKey] > cooldownDuration)) {
                // Calculate reflection
                const dotProduct = particle.velocityX * barrier.normal.x + particle.velocityY * barrier.normal.y;
                particle.velocityX -= 2 * dotProduct * barrier.normal.x * particle.elasticity;
                particle.velocityY -= 2 * dotProduct * barrier.normal.y * particle.elasticity;

                // Apply damping
                particle.velocityX *= particle.damping;
                particle.velocityY *= particle.damping;

                particle.bounceCount++;
                particle.bounceCooldown[bounceKey] = currentTime; // Store the time of bounce
            }
        });

        // Stronger gravity toward target as we approach the end
        const targetDx = particle.targetX - particle.currentX;
        const targetDy = particle.targetY - particle.currentY;
        const targetDistance = Math.sqrt(targetDx * targetDx + targetDy * targetDy);

        if (targetDistance > 5) {
            // Increase attraction strength as we approach the end of animation (pixels per second squared)
            const attractionStrength = (60 + (progress * 180)) * deltaTime; // Time-based acceleration
            particle.velocityX += (targetDx / targetDistance) * attractionStrength;
            particle.velocityY += (targetDy / targetDistance) * attractionStrength;
        }

        particle.x = particle.currentX;
        particle.y = particle.currentY;
    } else {
        // Smooth transition to target in final 5%
        const finalProgress = (progress - 0.95) / 0.05;
        const smoothFinal = finalProgress * finalProgress * (3 - 2 * finalProgress); // Smooth step

        particle.x = particle.currentX + (particle.targetX - particle.currentX) * smoothFinal;
        particle.y = particle.currentY + (particle.targetY - particle.currentY) * smoothFinal;

        // Gradually reduce velocity
        particle.velocityX *= (1 - smoothFinal);
        particle.velocityY *= (1 - smoothFinal);
    }

    // Check if particle has reached target (within 2 pixels)
    const distanceToTarget = Math.sqrt(
        Math.pow(particle.x - particle.targetX, 2) +
        Math.pow(particle.y - particle.targetY, 2)
    );

    if (distanceToTarget < 2) {
        // Snap to exact target position
        particle.x = particle.targetX;
        particle.y = particle.targetY;
        particle.currentX = particle.targetX;
        particle.currentY = particle.targetY;
        particle.velocityX = 0;
        particle.velocityY = 0;
    }

    // Visual effects based on bouncing
    const speed = Math.sqrt(particle.velocityX * particle.velocityX + particle.velocityY * particle.velocityY);

    // Scale increases with speed and bounces
    const speedScale = 1 + speed * 0.0001; // Adjusted for pixels per second
    const bounceScale = 1 + particle.bounceCount * 0.1;
    particle.scale = Math.max(particle.originalScale * (speedScale * bounceScale) / 4, 1);

    // Color changes with energy (speed) and bounce count
    const energyHue = Math.min(speed * 0.5, 120); // Adjusted for pixels per second
    const bounceHue = (particle.bounceCount * 60) % 360;
    const hue = (energyHue + bounceHue) % 360;
    const saturation = 70 + Math.min(speed * 0.01, 30); // Adjusted for pixels per second
    const lightness = 40 + Math.min(speed * 0.008, 40); // Adjusted for pixels per second

    particle.color = \`hsl(\${hue}, \${saturation}%, \${lightness}%)\`;

    // Opacity based on energy
    particle.opacity = 0.5 + Math.min(speed * 0.002, 0.5); // Adjusted for pixels per second

    // Trail effect after bounces
    if (particle.bounceCount > 0) {
        const trailIntensity = Math.min(particle.bounceCount * 0.2, 1);
        particle.opacity = Math.max(particle.opacity, 0.3 + trailIntensity * 0.7);
    }
}`,tt=()=>Object.assign({},{[E]:{code:`${f}${W}`},DEV_TWO_FRAMES:{code:`${f}${H}`},bezier:{code:`${f}${Q}`},pulseColorCycle:{code:`${f}${K}`},timeDistortion:{code:`${f}${G}`},elasticPlop:{code:`${f}${J}`}},...V.map(({name:e,comment:a,definition:n})=>({[e]:{code:`${f}return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
    // This is obviously inefficient because the same constant will be recalculated for every particle, but this is a playground and its not that expensive.
    ${a}
    ${n}
    const lerp = (start, end, t) => start + t * (end - start);

    const totalElapsedTime = currentTime - animationStartTime;
    const progress = Math.min(totalElapsedTime / animationDuration, 1);
    const easedProgress = ${e}(progress);

    particle.x = lerp(particle.initialX, particle.targetX, easedProgress);
    particle.y = lerp(particle.initialY, particle.targetY, easedProgress);

    if (
        Math.abs(particle.x - particle.targetX) < 1 &&
        Math.abs(particle.y - particle.targetY) < 1
    ) {
        particle.x = particle.targetX;
        particle.y = particle.targetY;
    }
};`}}))),A=(e,a)=>{const{width:r,height:i,data:c}=e,m=Math.ceil(r/a),s=Math.ceil(i/a),o=new Uint8Array(Math.ceil(r/a)*Math.ceil(i/a));let l=0;for(let u=0;u<i;u+=a)for(let p=0;p<r;p+=a){let g=!1;for(let h=0;h<a&&!g;h++)for(let d=0;d<a&&!g;d++){const M=p+d,v=u+h;if(M<r&&v<i){const ht=(v*r+M)*4;c[ht+3]>10&&(g=!0)}}o[l++]=g?1:0}return{validBlocks:o,blockWidth:m,blockHeight:s}},y=(e,a,n)=>e+n*(a-e),et=e=>{e=e.replace(/^#/,"");const a=parseInt(e,16),n=a>>16&255,r=a>>8&255,i=a&255;return{r:n,g:r,b:i}},at=e=>{const a=e.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);if(!a)return console.warn("Invalid HSL color format:",e),{r:0,g:0,b:0};const n=parseInt(a[1])/360,r=parseInt(a[2])/100,i=parseInt(a[3])/100,c=(l,u,p)=>(p<0&&(p+=1),p>1&&(p-=1),p<1/6?l+(u-l)*6*p:p<1/2?u:p<2/3?l+(u-l)*(2/3-p)*6:l);let m,s,o;if(r===0)m=s=o=i;else{const l=i<.5?i*(1+r):i+r-i*r,u=2*i-l;m=c(u,l,n+1/3),s=c(u,l,n),o=c(u,l,n-1/3)}return{r:Math.round(m*255),g:Math.round(s*255),b:Math.round(o*255)}},_=e=>e.startsWith("hsl(")?at(e):et(e),it=(e,a,n)=>"#"+((1<<24)+(e<<16)+(a<<8)+n).toString(16).slice(1),D=(e,a)=>{if(!(e!=null&&e.length))return"#ffffff";if(e.length===1)return e[0];const r=Math.max(0,Math.min(1,a))*(e.length-1),i=Math.floor(r);if(i===e.length-1)return e[e.length-1];const c=r-i,m=_(e[i]),s=_(e[i+1]),o=Math.round(y(m.r,s.r,c)),l=Math.round(y(m.g,s.g,c)),u=Math.round(y(m.b,s.b,c));return it(o,l,u)},b=({dimensions:{width:e,height:a},emitterX:n=e/2,emitterY:r=a/2,emitterSize:i=100,emitterAngle:c=0})=>({top:()=>({x:Math.random()*e,y:0}),center:()=>({x:Math.round(e/2),y:Math.round(a/2)}),bottom:()=>({x:Math.random()*e,y:a}),random:()=>({x:Math.random()*e,y:Math.random()*a}),left:()=>({x:0,y:Math.random()*a}),right:()=>({x:e,y:Math.random()*a}),"top-left":()=>({x:Math.random()*(e/5),y:Math.random()*(a/5)}),"top-right":()=>({x:e,y:Math.random()*(a/5)}),"bottom-left":()=>({x:Math.random()*(e/5),y:a-Math.random()*(a/5)}),"bottom-right":()=>({x:e-Math.random()*(e/5),y:a-Math.random()*(a/5)}),canvasEdges:()=>{const s=Math.floor(Math.random()*4);return s===0?{x:Math.random()*e,y:0}:s===1?{x:Math.random()*e,y:a}:s===2?{x:0,y:Math.random()*a}:{x:e,y:Math.random()*a}},topLeft:()=>({x:0,y:0}),emitterPoint:()=>({x:n,y:r}),emitterCircle:()=>{const s=Math.random()*2*Math.PI,o=Math.random()*i;return{x:n+o*Math.cos(s),y:r+o*Math.sin(s)}},emitterSquare:()=>({x:n+(Math.random()-.5)*i,y:r+(Math.random()-.5)*i}),emitterHLine:()=>{const s=c*(Math.PI/180),o=(Math.random()-.5)*i;return{x:n+o*Math.cos(s),y:r+o*Math.sin(s)}},emitterVLine:()=>{const s=(c+90)*(Math.PI/180),o=(Math.random()-.5)*i;return{x:n+o*Math.cos(s),y:r+o*Math.sin(s)}},enterTopTextWidth:()=>({x:e*.2+Math.random()*e*.6,y:a*.3}),enterBottomTextWidth:()=>({x:e*.2+Math.random()*e*.6,y:a*.7}),enterLeftTextHeight:()=>({x:e*.2,y:a*.3+Math.random()*a*.4}),enterRightTextHeight:()=>({x:e*.8,y:a*.3+Math.random()*a*.4})});let O;const S={particleRadius:5,startPosition:F,selectedMovementFunction:E,movementFunctionCode:tt()[E].code,text:U,font:q,particleColors:B,animationDuration:3e3,particleSpread:3,startParticleOpacity:1,endParticleOpacity:1,startParticleSize:5,endParticleSize:1,particleSizeEasing:w,particleOpacityEasing:L,delay:0,emitterX:$,emitterY:z,emitterSize:j,emitterAngle:Z,enableRevealAnimation:!1,revealDirection:N},t={workerParticles:[],imageBitmap:null,animationFrameId:0,frameCanvas:null,frameContext:null,mainCanvas:null,mainContext:null,validBlocks:null,blockHeight:0,blockWidth:0,appProps:S,revealProgress:0};let I;const rt=async e=>{t.mainCanvas=e,t.mainContext=t.mainCanvas.getContext("bitmaprenderer"),t.frameCanvas=new OffscreenCanvas(t.mainCanvas.width,t.mainCanvas.height),t.frameContext=t.frameCanvas.getContext("2d",{willReadFrequently:!0})},nt=e=>{const{imageBitmap:a,canvas:n,dimensions:r,appProps:i}=e;t.imageBitmap=a,Object.keys(i).length&&(t.appProps={...S,...i}),rt(n),t.frameContext.drawImage(t.imageBitmap,0,0);const{validBlocks:c,blockHeight:m,blockWidth:s}=A(t.frameContext.getImageData(0,0,t.mainCanvas.width,t.mainCanvas.height),t.appProps.particleRadius);t.validBlocks=c,t.blockHeight=m,t.blockWidth=s,I=b({dimensions:r,emitterX:t.appProps.emitterX,emitterY:t.appProps.emitterY,emitterSize:t.appProps.emitterSize,emitterAngle:t.appProps.emitterAngle}),t.workerParticles=C({validBlocks:t.validBlocks,radius:t.appProps.particleRadius,blockHeight:t.blockHeight,blockWidth:t.blockWidth,startPosition:t.appProps.startPosition,delay:t.appProps.delay,animationDuration:t.appProps.animationDuration}),self.postMessage({type:P.INITIALIZED,data:t.appProps})},C=({validBlocks:e,radius:a,blockHeight:n,blockWidth:r,startPosition:i,delay:c,animationDuration:m})=>{const s=[];for(let o=0;o<n;o++)for(let l=0;l<r;l++){const u=o*r+l;if(e[u]){const p=l*a,g=o*a,{x:h,y:d}=I[i](),M=Math.random()*c,v=m-M;s.push({targetX:p,targetY:g,x:h,y:d,initialX:h,initialY:d,scale:1,opacity:1,color:k,revealProgress:0,revealThreshold:.97+Math.random()*.02,reachedTarget:!1,emittedBubbles:!1,delay:M,lifetime:v})}}return s},ot=(e,a,n,r)=>{switch(n){case"left-to-right":{const i=a*r.width;return e.targetX<=i}case"right-to-left":{const i=(1-a)*r.width;return e.targetX>=i}case"top-to-bottom":{const i=a*r.height;return e.targetY<=i}case"bottom-to-top":{const i=(1-a)*r.height;return e.targetY>=i}default:return!0}},st=(e,a)=>{if(a>(e.revealThreshold||.99))return 1;if(a>.85&&Math.sqrt(Math.pow(e.x-e.targetX,2)+Math.pow(e.y-e.targetY,2))<=5){const i=(e.revealThreshold||.99)-.02,c=Math.max(0,(a-i)/.02);return Math.min(1,c)}return 0},R=e=>{const a=t.appProps.startParticleOpacity,n=t.appProps.endParticleOpacity,r=ct(e,t.appProps.particleOpacityEasing);if(t.appProps.particleOpacityEasing!=="linear"){const i=Math.min(a,n),c=Math.max(a,n);return i+(c-i)*r}return a+(n-a)*r},ct=(e,a)=>{switch(a){case"bell":return Math.sin(e*Math.PI);case"linear":return e;case"multiPulse":const r=e*5%1;return Math.sin(r*Math.PI);default:return 1}},lt=(e,a)=>{switch(a){case"bell":return Math.sin(e*Math.PI);case"linear":return e;case"multiPulse":const r=e*5%1;return Math.sin(r*Math.PI);default:return 1}},pt=e=>{const a=t.appProps.startParticleSize,n=t.appProps.endParticleSize,r=lt(e,t.appProps.particleSizeEasing);if(t.appProps.particleSizeEasing!=="linear"){const i=Math.min(a,n),c=Math.max(a,n);return i+(c-i)*r}return a+(n-a)*r},Y=(e,a)=>{t.frameContext.clearRect(0,0,t.frameCanvas.width,t.frameCanvas.height);const n=a-e;t.revealProgress=Math.min(1,n/t.appProps.animationDuration),t.frameContext.globalAlpha=1,t.workerParticles.forEach(i=>{if(i.delay>a-e||!ot(i,t.revealProgress,t.appProps.revealDirection,{width:t.mainCanvas.width,height:t.mainCanvas.height}))return;const m=n-i.delay,s=Math.max(0,Math.min(1,m/i.lifetime)),o=R(s);t.frameContext.globalAlpha=o,t.frameContext.drawImage(t.imageBitmap,i.targetX,i.targetY,t.appProps.particleRadius,t.appProps.particleRadius,Math.floor(i.x),Math.floor(i.y),t.appProps.particleRadius,t.appProps.particleRadius)});const r=t.frameCanvas.transferToImageBitmap();if(t.mainContext.transferFromImageBitmap(r),t.revealProgress<1)t.animationFrameId=requestAnimationFrame(i=>Y(e,i));else{t.frameContext.drawImage(t.imageBitmap,0,0);const i=t.frameCanvas.transferToImageBitmap();t.mainContext.transferFromImageBitmap(i),self.postMessage({type:P.ANIMATION_COMPLETE})}},x=(e,a)=>{let n=!0;t.frameContext.clearRect(0,0,t.frameCanvas.width,t.frameCanvas.height);const r=a-e;t.revealProgress=Math.min(1,r/t.appProps.animationDuration),t.frameContext.globalAlpha=1,t.workerParticles.forEach(o=>{if(o.delay>a-e)return;const l=r-o.delay,u=Math.max(0,Math.min(1,l/o.lifetime));O(o,e,a,{width:t.mainCanvas.width,height:t.mainCanvas.height},t.appProps.animationDuration);const p=st(o,t.revealProgress),g=R(u),h=pt(u);if(p>0&&p<1){const d=t.appProps.particleRadius*(h||1);t.frameContext.globalAlpha=g*(1-p),t.frameContext.beginPath(),t.frameContext.arc(Math.floor(o.x)+d/2,Math.floor(o.y)+d/2,d/2,0,2*Math.PI),t.frameContext.fillStyle=t.appProps.particleColors.length?D(t.appProps.particleColors,t.revealProgress):o.color,t.frameContext.fill(),t.frameContext.globalAlpha=p*g,t.frameContext.drawImage(t.imageBitmap,o.targetX,o.targetY,h,h,Math.floor(o.x),Math.floor(o.y),h,h)}else if(p>=1)t.frameContext.globalAlpha=1,t.frameContext.drawImage(t.imageBitmap,o.targetX,o.targetY,t.appProps.particleRadius,t.appProps.particleRadius,Math.floor(o.x),Math.floor(o.y),t.appProps.particleRadius,t.appProps.particleRadius);else{const d=t.appProps.particleRadius*(h||1);t.frameContext.globalAlpha=g,t.frameContext.beginPath(),t.frameContext.arc(Math.floor(o.x)+d/2,Math.floor(o.y)+d/2,d/2,0,2*Math.PI),t.frameContext.fillStyle=t.appProps.particleColors.length?D(t.appProps.particleColors,t.revealProgress):o.color,t.frameContext.fill()}(o.x!==o.targetX||o.y!==o.targetY||t.revealProgress<.99)&&(n=!1)});const i=t.frameCanvas.transferToImageBitmap();t.mainContext.transferFromImageBitmap(i);const c=n&&t.revealProgress>=1,m=t.appProps.animationDuration;c&&r>=m?t.animationFrameId&&(cancelAnimationFrame(t.animationFrameId),t.frameContext.drawImage(t.imageBitmap,0,0),self.postMessage({type:P.ANIMATION_COMPLETE})):t.animationFrameId=requestAnimationFrame(o=>x(e,o))},mt=()=>{t.animationFrameId&&cancelAnimationFrame(t.animationFrameId),O=new Function(t.appProps.movementFunctionCode)();const e=performance.now();t.revealProgress=0,t.appProps.enableRevealAnimation?Y(e,e):x(e,e)},X=()=>{t.animationFrameId&&cancelAnimationFrame(t.animationFrameId),t.workerParticles=t.workerParticles.map(a=>{const n=I[t.appProps.startPosition](),r=Math.random()*t.appProps.delay,i=t.appProps.animationDuration-r;return{x:n.x,y:n.y,initialX:n.x,initialY:n.y,targetX:a.targetX,targetY:a.targetY,scale:1,opacity:1,color:a.color,revealProgress:0,revealThreshold:a.revealThreshold,delay:r,lifetime:i}}),t.frameContext.clearRect(0,0,t.frameCanvas.width,t.frameCanvas.height);const e=t.frameCanvas.transferToImageBitmap();t.mainContext.transferFromImageBitmap(e),t.animationFrameId&&cancelAnimationFrame(t.animationFrameId)},ut=e=>{if(t.imageBitmap=e,t.frameCanvas&&t.mainCanvas){t.frameCanvas.width=t.imageBitmap.width,t.frameCanvas.height=t.imageBitmap.height,t.mainCanvas.width=t.imageBitmap.width,t.mainCanvas.height=t.imageBitmap.height,t.frameContext.drawImage(t.imageBitmap,0,0);const{validBlocks:a,blockHeight:n,blockWidth:r}=A(t.frameContext.getImageData(0,0,t.mainCanvas.width,t.mainCanvas.height),t.appProps.particleRadius);t.validBlocks=a,t.blockHeight=n,t.blockWidth=r,I=b({dimensions:{width:t.mainCanvas.width,height:t.mainCanvas.height},emitterX:t.appProps.emitterX,emitterY:t.appProps.emitterY,emitterSize:t.appProps.emitterSize,emitterAngle:t.appProps.emitterAngle}),t.frameContext.clearRect(0,0,t.frameCanvas.width,t.frameCanvas.height);const i=t.frameCanvas.transferToImageBitmap();t.mainContext.transferFromImageBitmap(i),t.workerParticles=C({validBlocks:t.validBlocks,radius:t.appProps.particleRadius,blockHeight:t.blockHeight,blockWidth:t.blockWidth,startPosition:t.appProps.startPosition,delay:t.appProps.delay,animationDuration:t.appProps.animationDuration})}},dt=e=>{const{appProps:a,shouldUpdateStartCoordinatesConfig:n,shouldRegenerateImageBlocks:r}=e;if(Object.assign(t.appProps,a),r){t.frameContext.drawImage(t.imageBitmap,0,0);const{validBlocks:i,blockHeight:c,blockWidth:m}=A(t.frameContext.getImageData(0,0,t.mainCanvas.width,t.mainCanvas.height),t.appProps.particleRadius);t.validBlocks=i,t.blockHeight=c,t.blockWidth=m}if(n&&(I=b({dimensions:{width:t.mainCanvas.width,height:t.mainCanvas.height},emitterX:t.appProps.emitterX,emitterY:t.appProps.emitterY,emitterSize:t.appProps.emitterSize,emitterAngle:t.appProps.emitterAngle})),t.workerParticles=C({validBlocks:t.validBlocks??new Uint8Array,radius:t.appProps.particleRadius,blockHeight:t.blockHeight,blockWidth:t.blockWidth,startPosition:t.appProps.startPosition,delay:t.appProps.delay,animationDuration:t.appProps.animationDuration}),self.postMessage({type:P.UPDATE_APP_PROPS,data:t.appProps}),t.animationFrameId){cancelAnimationFrame(t.animationFrameId);const i=performance.now();x(i,i)}};self.onmessage=e=>{const{payload:a,type:n}=e.data;switch(n){case T.INITIALIZE:{nt(a);break}case T.PLAY:{mt();break}case T.RESET:{X();break}case T.UPDATE_APP_PROPS:{dt(a);break}case T.UPDATE_BITMAP:{ut(a);break}case T.UPDATE_REVEAL_ANIMATION:{const r=a;t.appProps.enableRevealAnimation=r,self.postMessage({type:P.UPDATE_APP_PROPS,data:t.appProps}),r&&X();break}}}})();
