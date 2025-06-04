(function(){"use strict";const B="linear",N="linear",q="random",b="backInOut",H=`WIX 🤠
Particles!`,P="#ffffff",W=["#ff0000","#00ff00","#0000ff"],$="left-to-right",z={fontFamily:"Arial",fontSize:64,italic:!1,weight:600},j=`// This function will be called twice for each particle, because all particles reach the target in two frames.
return (particle, animationStartTime, currentTime, canvasDimensions) => {
    if (particle.x === 0 && particle.y === 0) {
        particle.x = particle.targetX;
        particle.y = particle.targetY;
    } else {
        particle.x = 0
        particle.y = 0
    }
}`,g=`/**
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
`,V=`${g}
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
}`,Z=500,Q=300,K=100,G=0,O=1e3,S=500;var f=(e=>(e.INITIALIZE="INITIALIZE",e.PLAY="PLAY",e.RESET="RESET",e.UPDATE_APP_PROPS="UPDATE_APP_PROPS",e.UPDATE_BITMAP="UPDATE_BITMAP",e.RESIZE_PARTICLE_RADIUS="RESIZE_PARTICLE_RADIUS",e.UPDATE_START_POSITION="UPDATE_START_POSITION",e.UPDATE_SELECTED_MOVEMENT_FUNCTION="UPDATE_SELECTED_MOVEMENT_FUNCTION",e.UPDATE_TEXT="UPDATE_TEXT",e.UPDATE_FONT="UPDATE_FONT",e.UPDATE_PARTICLE_COLORS="UPDATE_PARTICLE_COLORS",e.UPDATE_ANIMATION_DURATION="UPDATE_ANIMATION_DURATION",e.UPDATE_PARTICLE_SPREAD="UPDATE_PARTICLE_SPREAD",e.UPDATE_START_PARTICLE_OPACITY="UPDATE_START_PARTICLE_OPACITY",e.UPDATE_END_PARTICLE_OPACITY="UPDATE_END_PARTICLE_OPACITY",e.UPDATE_START_PARTICLE_SIZE="UPDATE_START_PARTICLE_SIZE",e.UPDATE_END_PARTICLE_SIZE="UPDATE_END_PARTICLE_SIZE",e.UPDATE_DELAY="UPDATE_DELAY",e.UPDATE_REVEAL_ANIMATION="UPDATE_REVEAL_ANIMATION",e.UPDATE_REVEAL_DIRECTION="UPDATE_REVEAL_DIRECTION",e))(f||{}),I=(e=>(e.INITIALIZED="INITIALIZED",e.UPDATE_APP_PROPS="UPDATE_APP_PROPS",e.ANIMATION_COMPLETE="ANIMATION_COMPLETE",e))(I||{});const J=[{name:"linear",definition:"const linear = (t) => t;",comment:`/**
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
    }`,comment:""}],tt=`return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
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
`,et=`return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
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
}`,at=`return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
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
}`,it=`return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
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
}`,rt=()=>Object.assign({},{[b]:{code:`${g}${V}`},DEV_TWO_FRAMES:{code:`${g}${j}`},bezier:{code:`${g}${tt}`},pulseColorCycle:{code:`${g}${et}`},timeDistortion:{code:`${g}${at}`},elasticPlop:{code:`${g}${it}`}},...J.map(({name:e,comment:a,definition:i})=>({[e]:{code:`${g}return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
    // This is obviously inefficient because the same constant will be recalculated for every particle, but this is a playground and its not that expensive.
    ${a}
    ${i}
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
};`}}))),y=(e,a)=>{const{width:n,height:o,data:c}=e,l=Math.ceil(n/a),s=Math.ceil(o/a),r=new Uint8Array(Math.ceil(n/a)*Math.ceil(o/a));let p=0;for(let m=0;m<o;m+=a)for(let u=0;u<n;u+=a){let d=!1;for(let h=0;h<a&&!d;h++)for(let T=0;T<a&&!d;T++){const E=u+T,M=m+h;if(E<n&&M<o){const R=(M*n+E)*4;c[R+3]>10&&(d=!0)}}r[p++]=d?1:0}return{validBlocks:r,blockWidth:l,blockHeight:s}},A=(e,a,i)=>e+i*(a-e),nt=e=>{e=e.replace(/^#/,"");const a=parseInt(e,16),i=a>>16&255,n=a>>8&255,o=a&255;return{r:i,g:n,b:o}},ot=e=>{const a=e.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);if(!a)return console.warn("Invalid HSL color format:",e),{r:0,g:0,b:0};const i=parseInt(a[1])/360,n=parseInt(a[2])/100,o=parseInt(a[3])/100,c=(p,m,u)=>(u<0&&(u+=1),u>1&&(u-=1),u<1/6?p+(m-p)*6*u:u<1/2?m:u<2/3?p+(m-p)*(2/3-u)*6:p);let l,s,r;if(n===0)l=s=r=o;else{const p=o<.5?o*(1+n):o+n-o*n,m=2*o-p;l=c(m,p,i+1/3),s=c(m,p,i),r=c(m,p,i-1/3)}return{r:Math.round(l*255),g:Math.round(s*255),b:Math.round(r*255)}},Y=e=>{if(!e||typeof e!="string")throw new Error(`Invalid color string provided to parseColor: ${JSON.stringify(e)}`);return e.startsWith("hsl(")?ot(e):nt(e)},st=(e,a,i)=>"#"+((1<<24)+(e<<16)+(a<<8)+i).toString(16).slice(1),w=(e,a)=>{if(!(e!=null&&e.length))return"#ffffff";const i=e.filter(d=>d&&typeof d=="string");if(!i.length)throw new Error(`Invalid colors provided to getColorFromProgress: ${JSON.stringify(e)}`);if(i.length===1)return i[0];const o=Math.max(0,Math.min(1,a))*(i.length-1),c=Math.floor(o);if(c===i.length-1)return i[i.length-1];const l=o-c,s=Y(i[c]),r=Y(i[c+1]),p=Math.round(A(s.r,r.r,l)),m=Math.round(A(s.g,r.g,l)),u=Math.round(A(s.b,r.b,l));return st(p,m,u)},C=({dimensions:{width:e,height:a},emitterX:i=e/2,emitterY:n=a/2,emitterSize:o=100,emitterAngle:c=0})=>({top:()=>({x:Math.random()*e,y:0}),center:()=>({x:Math.round(e/2),y:Math.round(a/2)}),bottom:()=>({x:Math.random()*e,y:a}),random:()=>({x:Math.random()*e,y:Math.random()*a}),left:()=>({x:0,y:Math.random()*a}),right:()=>({x:e,y:Math.random()*a}),"top-left":()=>({x:Math.random()*(e/5),y:Math.random()*(a/5)}),"top-right":()=>({x:e,y:Math.random()*(a/5)}),"bottom-left":()=>({x:Math.random()*(e/5),y:a-Math.random()*(a/5)}),"bottom-right":()=>({x:e-Math.random()*(e/5),y:a-Math.random()*(a/5)}),canvasEdges:()=>{const s=Math.floor(Math.random()*4);return s===0?{x:Math.random()*e,y:0}:s===1?{x:Math.random()*e,y:a}:s===2?{x:0,y:Math.random()*a}:{x:e,y:Math.random()*a}},topLeft:()=>({x:0,y:0}),emitterPoint:()=>({x:i,y:n}),emitterCircle:()=>{const s=Math.random()*2*Math.PI,r=Math.random()*o;return{x:i+r*Math.cos(s),y:n+r*Math.sin(s)}},emitterSquare:()=>({x:i+(Math.random()-.5)*o,y:n+(Math.random()-.5)*o}),emitterHLine:()=>{const s=c*(Math.PI/180),r=(Math.random()-.5)*o;return{x:i+r*Math.cos(s),y:n+r*Math.sin(s)}},emitterVLine:()=>{const s=(c+90)*(Math.PI/180),r=(Math.random()-.5)*o;return{x:i+r*Math.cos(s),y:n+r*Math.sin(s)}},enterTopTextWidth:()=>({x:e*.2+Math.random()*e*.6,y:a*.3}),enterBottomTextWidth:()=>({x:e*.2+Math.random()*e*.6,y:a*.7}),enterLeftTextHeight:()=>({x:e*.2,y:a*.3+Math.random()*a*.4}),enterRightTextHeight:()=>({x:e*.8,y:a*.3+Math.random()*a*.4})});let X;const L={particleRadius:5,startPosition:q,selectedMovementFunction:b,movementFunctionCode:rt()[b].code,text:H,font:z,particleColors:W,animationDuration:3e3,particleSpread:3,startParticleOpacity:1,endParticleOpacity:1,startParticleSize:5,endParticleSize:1,particleSizeEasing:B,particleOpacityEasing:N,delay:0,emitterX:Z,emitterY:Q,emitterSize:K,emitterAngle:G,enableRevealAnimation:!1,revealDirection:$},t={workerParticles:[],imageBitmap:null,animationFrameId:0,frameCanvas:null,frameContext:null,mainCanvas:null,mainContext:null,validBlocks:null,blockHeight:0,blockWidth:0,appProps:L,revealProgress:0,effectParticles:[]};let v;const ct=async e=>{t.mainCanvas=e,t.mainContext=t.mainCanvas.getContext("bitmaprenderer"),t.frameCanvas=new OffscreenCanvas(t.mainCanvas.width,t.mainCanvas.height),t.frameContext=t.frameCanvas.getContext("2d",{willReadFrequently:!0})},lt=e=>{const{imageBitmap:a,canvas:i,dimensions:n,appProps:o}=e;t.imageBitmap=a,Object.keys(o).length&&(t.appProps={...L,...o}),ct(i),t.frameContext.drawImage(t.imageBitmap,0,0);const{validBlocks:c,blockHeight:l,blockWidth:s}=y(t.frameContext.getImageData(0,0,t.mainCanvas.width,t.mainCanvas.height),t.appProps.particleRadius);t.validBlocks=c,t.blockHeight=l,t.blockWidth=s,v=C({dimensions:n,emitterX:t.appProps.emitterX,emitterY:t.appProps.emitterY,emitterSize:t.appProps.emitterSize,emitterAngle:t.appProps.emitterAngle}),t.workerParticles=x({validBlocks:t.validBlocks,radius:t.appProps.particleRadius,blockHeight:t.blockHeight,blockWidth:t.blockWidth,startPosition:t.appProps.startPosition,delay:t.appProps.delay,animationDuration:t.appProps.animationDuration,revealAnimation:t.appProps.enableRevealAnimation}),self.postMessage({type:I.INITIALIZED,data:t.appProps})},x=({validBlocks:e,radius:a,blockHeight:i,blockWidth:n,startPosition:o,delay:c,animationDuration:l,revealAnimation:s})=>{const r=[];for(let p=0;p<i;p++)for(let m=0;m<n;m++){const u=p*n+m;if(e[u]){const d=m*a,h=p*a,{x:T,y:E}=s?{x:d,y:h}:v[o](),M=s?0:Math.random()*c,R=l-M;r.push({targetX:d,targetY:h,x:T,y:E,initialX:T,initialY:E,scale:1,opacity:1,color:P,revealProgress:0,revealThreshold:.97+Math.random()*.02,reachedTarget:!1,emittedBubbles:!1,delay:M,lifetime:R,radius:a})}}return r},pt=e=>{if(e.length===0)return{width:0,height:0,minX:0,minY:0,maxX:0,maxY:0};let a=1/0,i=1/0,n=-1/0,o=-1/0;return e.forEach(c=>{a=Math.min(a,c.targetX),i=Math.min(i,c.targetY),n=Math.max(n,c.targetX+t.appProps.particleRadius),o=Math.max(o,c.targetY+t.appProps.particleRadius)}),{minX:a,minY:i,maxX:n,maxY:o,width:n-a,height:o-i}},mt=(e,a,i,n)=>{switch(i){case"left-to-right":{const o=n.minX+a*n.width;return e.targetX<=o}case"right-to-left":{const o=n.maxX-a*n.width;return e.targetX>=o}case"top-to-bottom":{const o=n.minY+a*n.height;return e.targetY<=o}case"bottom-to-top":{const o=n.maxY-a*n.height;return e.targetY>=o}default:return!0}},ut=(e,a)=>{if(a>(e.revealThreshold||.99))return 1;if(a>.85&&Math.sqrt(Math.pow(e.x-e.targetX,2)+Math.pow(e.y-e.targetY,2))<=5){const o=(e.revealThreshold||.99)-.02,c=Math.max(0,(a-o)/.02);return Math.min(1,c)}return 0},k=e=>{const a=t.appProps.startParticleOpacity,i=t.appProps.endParticleOpacity,n=dt(e,t.appProps.particleOpacityEasing);if(t.appProps.particleOpacityEasing!=="linear"){const o=Math.min(a,i),c=Math.max(a,i);return o+(c-o)*n}return a+(i-a)*n},dt=(e,a)=>{switch(a){case"bell":return Math.sin(e*Math.PI);case"linear":return e;case"multiPulse":const n=e*5%1;return Math.sin(n*Math.PI);default:return 1}},ht=(e,a)=>{switch(a){case"bell":return Math.sin(e*Math.PI);case"linear":return e;case"multiPulse":const n=e*5%1;return Math.sin(n*Math.PI);default:return 1}},F=e=>{const a=t.appProps.startParticleSize,i=t.appProps.endParticleSize,n=ht(e,t.appProps.particleSizeEasing);if(t.appProps.particleSizeEasing!=="linear"){const o=Math.min(a,i),c=Math.max(a,i);return o+(c-o)*n}return a+(i-a)*n},_=(e,a,i=!0)=>{const n=k(a),o=F(a),c=e.radius*o;let l;try{l=t.appProps.particleColors.length?w(t.appProps.particleColors,a):e.color,(!l||typeof l!="string")&&(l=P)}catch(p){console.warn("Error getting particle color:",p),l=P}const s=i?Math.floor(e.x)+c/2:Math.floor(e.x),r=i?Math.floor(e.y)+c/2:Math.floor(e.y);t.frameContext.globalAlpha=n,t.frameContext.beginPath(),t.frameContext.arc(s,r,c/2,0,2*Math.PI),t.frameContext.fillStyle=l,t.frameContext.fill()},gt=(e,a)=>{const i=[],n=3+Math.floor(Math.random()*3),o=0;for(let c=0;c<n;c++){let l=0,s=0;const r=.5+Math.random()*1;switch(t.appProps.revealDirection){case"left-to-right":l=r,s=0;break;case"right-to-left":l=-r,s=0;break;case"top-to-bottom":l=0,s=r;break;case"bottom-to-top":l=0,s=-r;break}const p=.8,m=l+(Math.random()-.5)*p,u=s+(Math.random()-.5)*p;i.push({x:e.x+t.appProps.particleRadius/2,y:e.y+t.appProps.particleRadius/2,vx:m,vy:u,startTime:a,lifetime:S+Math.random()*(O-S),radius:t.appProps.particleRadius,opacity:1,progress:o,color:(()=>{try{return t.appProps.particleColors.length?w(t.appProps.particleColors,o):P}catch(d){return console.warn("Error getting effect particle color:",d),P}})()})}return i},U=(e,a,i)=>{t.frameContext.clearRect(0,0,t.frameCanvas.width,t.frameCanvas.height);const n=a-e,o=t.appProps.animationDuration-O;t.revealProgress=Math.min(1,n/t.appProps.animationDuration);const c=Math.min(1,n/o);t.frameContext.globalAlpha=1,t.workerParticles.forEach((s,r)=>{if(mt(s,c,t.appProps.revealDirection,i)){if(!s.emittedBubbles&&(s.emittedBubbles=!0,r%2===0)){const m=gt(s,a);t.effectParticles.push(...m)}t.frameContext.drawImage(t.imageBitmap,s.targetX,s.targetY,t.appProps.particleRadius,t.appProps.particleRadius,Math.floor(s.x),Math.floor(s.y),t.appProps.particleRadius,t.appProps.particleRadius)}});for(let s=t.effectParticles.length-1;s>=0;s--){const r=t.effectParticles[s],p=a-r.startTime;if(r.progress=Math.min(1,p/r.lifetime),r.progress>=1){t.effectParticles.splice(s,1);continue}r.x+=r.vx,r.y+=r.vy,r.vx*=.99,r.vy*=.99,_(r,r.progress,!1)}t.frameContext.globalAlpha=1;const l=t.frameCanvas.transferToImageBitmap();if(t.mainContext.transferFromImageBitmap(l),t.revealProgress<1)t.animationFrameId=requestAnimationFrame(s=>U(e,s,i));else{t.frameContext.drawImage(t.imageBitmap,0,0);const s=t.frameCanvas.transferToImageBitmap();t.mainContext.transferFromImageBitmap(s),t.effectParticles=[],t.workerParticles.forEach(r=>{r.emittedBubbles=!1}),self.postMessage({type:I.ANIMATION_COMPLETE})}},D=(e,a)=>{let i=!0;t.frameContext.clearRect(0,0,t.frameCanvas.width,t.frameCanvas.height);const n=a-e;t.revealProgress=Math.min(1,n/t.appProps.animationDuration),t.frameContext.globalAlpha=1,t.workerParticles.forEach(r=>{if(r.delay>a-e)return;const p=n-r.delay,m=Math.max(0,Math.min(1,p/r.lifetime));X(r,e,a,{width:t.mainCanvas.width,height:t.mainCanvas.height},t.appProps.animationDuration);const u=ut(r,t.revealProgress),d=k(m),h=F(m);u>0&&u<1?(_(r,m,!0),t.frameContext.globalAlpha=u*d,t.frameContext.drawImage(t.imageBitmap,r.targetX,r.targetY,h,h,Math.floor(r.x),Math.floor(r.y),h,h)):u>=1?(t.frameContext.globalAlpha=1,t.frameContext.drawImage(t.imageBitmap,r.targetX,r.targetY,t.appProps.particleRadius,t.appProps.particleRadius,Math.floor(r.x),Math.floor(r.y),t.appProps.particleRadius,t.appProps.particleRadius)):_(r,m,!0),(r.x!==r.targetX||r.y!==r.targetY||t.revealProgress<.99)&&(i=!1)});const o=t.frameCanvas.transferToImageBitmap();t.mainContext.transferFromImageBitmap(o);const c=i&&t.revealProgress>=1,l=t.appProps.animationDuration;c&&n>=l?t.animationFrameId&&(cancelAnimationFrame(t.animationFrameId),t.frameContext.drawImage(t.imageBitmap,0,0),self.postMessage({type:I.ANIMATION_COMPLETE})):t.animationFrameId=requestAnimationFrame(r=>D(e,r))},ft=()=>{t.animationFrameId&&cancelAnimationFrame(t.animationFrameId),t.effectParticles=[],X=new Function(t.appProps.movementFunctionCode)();const e=performance.now();if(t.revealProgress=0,t.appProps.enableRevealAnimation){const a=pt(t.workerParticles);t.frameContext.globalAlpha=1,t.workerParticles.forEach(i=>{i.emittedBubbles=!1}),U(e,e,a)}else D(e,e)},Tt=()=>{t.animationFrameId&&cancelAnimationFrame(t.animationFrameId),t.effectParticles=[],t.workerParticles=t.workerParticles.map(a=>{const i=v[t.appProps.startPosition](),n=Math.random()*t.appProps.delay,o=t.appProps.animationDuration-n;return{x:i.x,y:i.y,initialX:i.x,initialY:i.y,targetX:a.targetX,targetY:a.targetY,scale:1,opacity:1,color:a.color,revealProgress:0,revealThreshold:a.revealThreshold,reachedTarget:!1,emittedBubbles:!1,delay:n,lifetime:o,radius:t.appProps.particleRadius}}),t.frameContext.clearRect(0,0,t.frameCanvas.width,t.frameCanvas.height);const e=t.frameCanvas.transferToImageBitmap();t.mainContext.transferFromImageBitmap(e),t.animationFrameId&&cancelAnimationFrame(t.animationFrameId)},Pt=e=>{if(t.imageBitmap=e,t.frameCanvas&&t.mainCanvas){t.frameCanvas.width=t.imageBitmap.width,t.frameCanvas.height=t.imageBitmap.height,t.mainCanvas.width=t.imageBitmap.width,t.mainCanvas.height=t.imageBitmap.height,t.frameContext.drawImage(t.imageBitmap,0,0);const{validBlocks:a,blockHeight:i,blockWidth:n}=y(t.frameContext.getImageData(0,0,t.mainCanvas.width,t.mainCanvas.height),t.appProps.particleRadius);t.validBlocks=a,t.blockHeight=i,t.blockWidth=n,v=C({dimensions:{width:t.mainCanvas.width,height:t.mainCanvas.height},emitterX:t.appProps.emitterX,emitterY:t.appProps.emitterY,emitterSize:t.appProps.emitterSize,emitterAngle:t.appProps.emitterAngle}),t.frameContext.clearRect(0,0,t.frameCanvas.width,t.frameCanvas.height);const o=t.frameCanvas.transferToImageBitmap();t.mainContext.transferFromImageBitmap(o),t.workerParticles=x({validBlocks:t.validBlocks,radius:t.appProps.particleRadius,blockHeight:t.blockHeight,blockWidth:t.blockWidth,startPosition:t.appProps.startPosition,delay:t.appProps.delay,animationDuration:t.appProps.animationDuration,revealAnimation:t.appProps.enableRevealAnimation})}},It=e=>{const{appProps:a,shouldUpdateStartCoordinatesConfig:i,shouldRegenerateImageBlocks:n}=e;if(Object.assign(t.appProps,a),n){t.frameContext.drawImage(t.imageBitmap,0,0);const{validBlocks:o,blockHeight:c,blockWidth:l}=y(t.frameContext.getImageData(0,0,t.mainCanvas.width,t.mainCanvas.height),t.appProps.particleRadius);t.validBlocks=o,t.blockHeight=c,t.blockWidth=l}if(i&&(v=C({dimensions:{width:t.mainCanvas.width,height:t.mainCanvas.height},emitterX:t.appProps.emitterX,emitterY:t.appProps.emitterY,emitterSize:t.appProps.emitterSize,emitterAngle:t.appProps.emitterAngle})),t.workerParticles=x({validBlocks:t.validBlocks??new Uint8Array,radius:t.appProps.particleRadius,blockHeight:t.blockHeight,blockWidth:t.blockWidth,startPosition:t.appProps.startPosition,delay:t.appProps.delay,animationDuration:t.appProps.animationDuration,revealAnimation:t.appProps.enableRevealAnimation}),self.postMessage({type:I.UPDATE_APP_PROPS,data:t.appProps}),t.animationFrameId){cancelAnimationFrame(t.animationFrameId);const o=performance.now();D(o,o)}};self.onmessage=e=>{const{payload:a,type:i}=e.data;switch(i){case f.INITIALIZE:{lt(a);break}case f.PLAY:{ft();break}case f.RESET:{Tt();break}case f.UPDATE_APP_PROPS:{It(a);break}case f.UPDATE_BITMAP:{Pt(a);break}}}})();
