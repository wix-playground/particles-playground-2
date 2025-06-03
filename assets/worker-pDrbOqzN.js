(function(){"use strict";const w="random",y="backInOut",k=`WIX 🤠
Particles!`,Y="#ffffff",U=["#ff0000","#00ff00","#0000ff"],L={fontFamily:"Arial",fontSize:64,italic:!1,weight:600,letterSpacing:0,lineHeight:1.2},F=`// This function will be called twice for each particle, because all particles reach the target in two frames.
return (particle, animationStartTime, currentTime, canvasDimensions) => {
    if (particle.x === 0 && particle.y === 0) {
        particle.x = particle.targetX;
        particle.y = particle.targetY;
    } else {
        particle.x = 0
        particle.y = 0
    }
}`,b=`/**
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
`,X=`${b}
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
}`,D=1300;var p=(e=>(e.INITIALIZE="INITIALIZE",e.PLAY="PLAY",e.RESET="RESET",e.RESIZE_PARTICLE_RADIUS="RESIZE_PARTICLE_RADIUS",e.UPDATE_START_POSITION="UPDATE_START_POSITION",e.UPDATE_SELECTED_MOVEMENT_FUNCTION="UPDATE_SELECTED_MOVEMENT_FUNCTION",e.UPDATE_BITMAP="UPDATE_BITMAP",e.UPDATE_TEXT="UPDATE_TEXT",e.UPDATE_FONT="UPDATE_FONT",e.UPDATE_PARTICLE_COLORS="UPDATE_PARTICLE_COLORS",e.UPDATE_ANIMATION_DURATION="UPDATE_ANIMATION_DURATION",e.UPDATE_ENABLE_BUBBLES="UPDATE_ENABLE_BUBBLES",e.UPDATE_PARTICLE_SPREAD="UPDATE_PARTICLE_SPREAD",e.UPDATE_START_PARTICLE_OPACITY="UPDATE_START_PARTICLE_OPACITY",e.UPDATE_END_PARTICLE_OPACITY="UPDATE_END_PARTICLE_OPACITY",e.UPDATE_START_PARTICLE_SIZE="UPDATE_START_PARTICLE_SIZE",e.UPDATE_END_PARTICLE_SIZE="UPDATE_END_PARTICLE_SIZE",e.UPDATE_DELAY="UPDATE_DELAY",e))(p||{}),m=(e=>(e.INITIALIZED="INITIALIZED",e.UPDATE_APP_PROPS="UPDATE_APP_PROPS",e.ANIMATION_COMPLETE="ANIMATION_COMPLETE",e))(m||{});const B=[{name:"linear",definition:"const linear = (t) => t;",comment:`/**
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
    }`,comment:""}],N=`return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
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
`,q=`return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
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
}`,H=`return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
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
}`,W=`return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
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
}`,$=()=>Object.assign({},{[y]:{code:`${b}${X}`},DEV_TWO_FRAMES:{code:`${b}${F}`},bezier:{code:`${b}${N}`},pulseColorCycle:{code:`${b}${q}`},timeDistortion:{code:`${b}${H}`},elasticPlop:{code:`${b}${W}`}},...B.map(({name:e,comment:a,definition:o})=>({[e]:{code:`${b}return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
    // This is obviously inefficient because the same constant will be recalculated for every particle, but this is a playground and its not that expensive.
    ${a}
    ${o}
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
};`}}))),M=(e,a)=>{const{width:i,height:n,data:s}=e,l=Math.ceil(i/a),u=Math.ceil(n/a),r=new Uint8Array(Math.ceil(i/a)*Math.ceil(n/a));let c=0;for(let P=0;P<n;P+=a)for(let h=0;h<i;h+=a){let T=!1;for(let g=0;g<a&&!T;g++)for(let d=0;d<a&&!T;d++){const I=h+d,v=P+g;if(I<i&&v<n){const tt=(v*i+I)*4;s[tt+3]>10&&(T=!0)}}r[c++]=T?1:0}return{validBlocks:r,blockWidth:l,blockHeight:u}},_=(e,a,o)=>e+o*(a-e),x=e=>{e=e.replace(/^#/,"");const a=parseInt(e,16),o=a>>16&255,i=a>>8&255,n=a&255;return{r:o,g:i,b:n}},Z=(e,a,o)=>"#"+((1<<24)+(e<<16)+(a<<8)+o).toString(16).slice(1),C=(e,a)=>{if(!(e!=null&&e.length))return"#ffffff";if(e.length===1)return e[0];const i=Math.max(0,Math.min(1,a))*(e.length-1),n=Math.floor(i);if(n===e.length-1)return e[e.length-1];const s=i-n,l=x(e[n]),u=x(e[n+1]),r=Math.round(_(l.r,u.r,s)),c=Math.round(_(l.g,u.g,s)),P=Math.round(_(l.b,u.b,s));return Z(r,c,P)},S=({dimensions:{width:e,height:a}})=>({top:()=>({x:Math.random()*e,y:0}),center:()=>({x:Math.round(e/2),y:Math.round(a/2)}),bottom:()=>({x:Math.random()*e,y:a}),random:()=>({x:Math.random()*e,y:Math.random()*a}),left:()=>({x:0,y:Math.random()*a}),right:()=>({x:e,y:Math.random()*a}),"top-left":()=>({x:Math.random()*(e/5),y:Math.random()*(a/5)}),"top-right":()=>({x:e,y:Math.random()*(a/5)}),"bottom-left":()=>({x:Math.random()*(e/5),y:a-Math.random()*(a/5)}),"bottom-right":()=>({x:e-Math.random()*(e/5),y:a-Math.random()*(a/5)})});let O;const R={particleRadius:5,startPosition:w,selectedMovementFunction:y,movementFunctionCode:$()[y].code,text:k,font:L,particleColors:U,animationDuration:3e3,enableBubbles:!1,particleSpread:3,startParticleOpacity:1,endParticleOpacity:1,startParticleSize:5,endParticleSize:1,delay:0},t={workerParticles:[],bubbleParticles:[],imageBitmap:null,animationFrameId:0,frameCanvas:null,frameContext:null,mainCanvas:null,mainContext:null,validBlocks:null,blockHeight:0,blockWidth:0,appProps:R,revealProgress:0};let E;const j=async e=>{t.mainCanvas=e,t.mainContext=t.mainCanvas.getContext("bitmaprenderer"),t.frameCanvas=new OffscreenCanvas(t.mainCanvas.width,t.mainCanvas.height),t.frameContext=t.frameCanvas.getContext("2d",{willReadFrequently:!0})},z=e=>{const{imageBitmap:a,canvas:o,dimensions:i,appProps:n}=e;t.imageBitmap=a,Object.keys(n).length&&(t.appProps={...R,...n}),j(o),t.frameContext.drawImage(t.imageBitmap,0,0);const{validBlocks:s,blockHeight:l,blockWidth:u}=M(t.frameContext.getImageData(0,0,t.mainCanvas.width,t.mainCanvas.height),t.appProps.particleRadius);t.validBlocks=s,t.blockHeight=l,t.blockWidth=u,E=S({dimensions:i}),t.workerParticles=A({validBlocks:t.validBlocks,radius:t.appProps.particleRadius,blockHeight:t.blockHeight,blockWidth:t.blockWidth,startPosition:t.appProps.startPosition,delay:t.appProps.delay,animationDuration:t.appProps.animationDuration})},Q=(e,a,o,i,n=5)=>{const s=[];for(let l=0;l<n;l++){const u=Math.random()*Math.PI*2,r=.5+Math.random()*2;s.push({x:e,y:a,dx:Math.cos(u)*r,dy:Math.sin(u)*r-1,radius:2+Math.random()*5,color:o,opacity:.7+Math.random()*.3,createdAt:i,lifetime:D})}return s},A=({validBlocks:e,radius:a,blockHeight:o,blockWidth:i,startPosition:n,delay:s,animationDuration:l})=>{const u=[];for(let r=0;r<o;r++)for(let c=0;c<i;c++){const P=r*i+c;if(e[P]){const h=c*a,T=r*a,{x:g,y:d}=E[n](),I=Math.random()*s,v=l-I;u.push({targetX:h,targetY:T,x:g,y:d,initialX:g,initialY:d,scale:1,opacity:1,color:Y,revealProgress:0,revealThreshold:.97+Math.random()*.02,reachedTarget:!1,emittedBubbles:!1,delay:I,lifetime:v})}}return u},V=(e,a)=>{if(a>(e.revealThreshold||.99))return 1;if(a>.85&&Math.sqrt(Math.pow(e.x-e.targetX,2)+Math.pow(e.y-e.targetY,2))<=5){const n=(e.revealThreshold||.99)-.02,s=Math.max(0,(a-n)/.02);return Math.min(1,s)}return 0},K=e=>{const a=t.appProps.startParticleOpacity,o=t.appProps.endParticleOpacity;return a+(o-a)*e},G=e=>{const a=t.appProps.startParticleSize,o=t.appProps.endParticleSize;return a+(o-a)*e},f=(e,a)=>{let o=!0;t.frameContext.clearRect(0,0,t.frameCanvas.width,t.frameCanvas.height);const i=a-e;t.revealProgress=Math.min(1,i/t.appProps.animationDuration);for(let r=t.bubbleParticles.length-1;r>=0;r--){const c=t.bubbleParticles[r];c.x+=c.dx,c.y+=c.dy,c.dx+=(Math.random()-.5)*.1,c.dy-=.02;const P=a-c.createdAt,h=Math.min(1,P/c.lifetime),T=c.opacity*(1-h);t.frameContext.beginPath(),t.frameContext.arc(Math.floor(c.x),Math.floor(c.y),c.radius,0,Math.PI*2),t.frameContext.fillStyle=C(t.appProps.particleColors,h),t.frameContext.globalAlpha=T,t.frameContext.fill(),P>=c.lifetime&&t.bubbleParticles.splice(r,1)}t.frameContext.globalAlpha=1,t.workerParticles.forEach(r=>{if(r.delay>a-e)return;const c=i-r.delay,P=Math.max(0,Math.min(1,c/r.lifetime));O(r,e,a,{width:t.mainCanvas.width,height:t.mainCanvas.height},t.appProps.animationDuration);const h=V(r,t.revealProgress),T=K(P),g=G(P);if(h>0&&h<1){const d=t.appProps.particleRadius*(g||1);t.frameContext.globalAlpha=T*(1-h),t.frameContext.beginPath(),t.frameContext.arc(Math.floor(r.x)+d/2,Math.floor(r.y)+d/2,d/2,0,2*Math.PI),t.frameContext.fillStyle=t.appProps.particleColors.length?C(t.appProps.particleColors,t.revealProgress):r.color,t.frameContext.fill(),t.frameContext.globalAlpha=h*T,t.frameContext.drawImage(t.imageBitmap,r.targetX,r.targetY,g,g,Math.floor(r.x),Math.floor(r.y),g,g)}else if(h>=1)t.frameContext.globalAlpha=1,t.frameContext.drawImage(t.imageBitmap,r.targetX,r.targetY,t.appProps.particleRadius,t.appProps.particleRadius,Math.floor(r.x),Math.floor(r.y),t.appProps.particleRadius,t.appProps.particleRadius);else{const d=t.appProps.particleRadius*(g||1);t.frameContext.globalAlpha=T,t.frameContext.beginPath(),t.frameContext.arc(Math.floor(r.x)+d/2,Math.floor(r.y)+d/2,d/2,0,2*Math.PI),t.frameContext.fillStyle=t.appProps.particleColors.length?C(t.appProps.particleColors,t.revealProgress):r.color,t.frameContext.fill()}if(!r.emittedBubbles&&t.appProps.enableBubbles&&r.x===r.targetX&&r.y===r.targetY){r.emittedBubbles=!0;const d=Q(r.x,r.y,r.color,a,2+Math.floor(Math.random()*3));t.bubbleParticles.push(...d)}(r.x!==r.targetX||r.y!==r.targetY||t.revealProgress<.99)&&(o=!1)});const n=t.frameCanvas.transferToImageBitmap();t.mainContext.transferFromImageBitmap(n);const s=o&&t.revealProgress>=1,l=t.appProps.animationDuration+(t.appProps.enableBubbles?D:0);s&&i>=l?t.animationFrameId&&(cancelAnimationFrame(t.animationFrameId),t.bubbleParticles=[],t.frameContext.drawImage(t.imageBitmap,0,0),self.postMessage({type:m.ANIMATION_COMPLETE})):t.animationFrameId=requestAnimationFrame(r=>f(e,r))},J=()=>{O=new Function(t.appProps.movementFunctionCode)();const e=performance.now();t.revealProgress=0,t.bubbleParticles=[],t.workerParticles.forEach(a=>{a.emittedBubbles=!1}),f(e,e)};self.onmessage=e=>{const{payload:a,type:o}=e.data;switch(o){case p.INITIALIZE:{z(a),self.postMessage({type:m.INITIALIZED,data:t.appProps});break}case p.PLAY:{t.animationFrameId&&cancelAnimationFrame(t.animationFrameId),t.bubbleParticles=[],J();break}case p.RESET:{t.animationFrameId&&cancelAnimationFrame(t.animationFrameId),t.workerParticles=t.workerParticles.map(n=>{const s=E[t.appProps.startPosition](),l=Math.random()*t.appProps.delay,u=t.appProps.animationDuration-l;return{x:s.x,y:s.y,initialX:s.x,initialY:s.y,targetX:n.targetX,targetY:n.targetY,scale:1,opacity:1,color:n.color,revealProgress:0,revealThreshold:n.revealThreshold,delay:l,lifetime:u}}),t.frameContext.clearRect(0,0,t.frameCanvas.width,t.frameCanvas.height);const i=t.frameCanvas.transferToImageBitmap();t.mainContext.transferFromImageBitmap(i),t.animationFrameId&&cancelAnimationFrame(t.animationFrameId);break}case p.RESIZE_PARTICLE_RADIUS:{t.appProps.particleRadius=a,t.frameContext.drawImage(t.imageBitmap,0,0);const{validBlocks:i,blockHeight:n,blockWidth:s}=M(t.frameContext.getImageData(0,0,t.mainCanvas.width,t.mainCanvas.height),t.appProps.particleRadius);if(t.validBlocks=i,t.blockHeight=n,t.blockWidth=s,t.workerParticles=A({validBlocks:t.validBlocks,radius:t.appProps.particleRadius,blockHeight:t.blockHeight,blockWidth:t.blockWidth,startPosition:t.appProps.startPosition,delay:t.appProps.delay,animationDuration:t.appProps.animationDuration}),self.postMessage({type:m.UPDATE_APP_PROPS,data:t.appProps}),t.animationFrameId){cancelAnimationFrame(t.animationFrameId);const l=performance.now();f(l,l)}break}case p.UPDATE_START_POSITION:{if(t.appProps.startPosition=a,t.workerParticles.length){if(t.workerParticles.forEach(i=>{const n=E[t.appProps.startPosition]();i.initialX=n.x,i.initialY=n.y,i.x=n.x,i.y=n.y}),self.postMessage({type:m.UPDATE_APP_PROPS,data:t.appProps}),t.animationFrameId){cancelAnimationFrame(t.animationFrameId);const i=performance.now();f(i,i)}}else console.error("updateStartPosition failed, particles were not initialized",{workerParticles:t.workerParticles});break}case p.UPDATE_SELECTED_MOVEMENT_FUNCTION:{const{key:i,movementFunctionCode:n}=a??{};i&&(t.appProps.selectedMovementFunction=i),n!=null&&(t.appProps.movementFunctionCode=n),self.postMessage({type:m.UPDATE_APP_PROPS,data:t.appProps});break}case p.UPDATE_TEXT:{t.appProps.text=a,self.postMessage({type:m.UPDATE_APP_PROPS,data:t.appProps});break}case p.UPDATE_FONT:{t.appProps.font=a,self.postMessage({type:m.UPDATE_APP_PROPS,data:t.appProps});break}case p.UPDATE_PARTICLE_COLORS:{if(t.appProps.particleColors=a,a.length>0,self.postMessage({type:m.UPDATE_APP_PROPS,data:t.appProps}),t.animationFrameId){cancelAnimationFrame(t.animationFrameId);const i=performance.now();f(i,i)}break}case p.UPDATE_BITMAP:{if(t.imageBitmap=a,t.frameCanvas&&t.mainCanvas){t.frameCanvas.width=t.imageBitmap.width,t.frameCanvas.height=t.imageBitmap.height,t.mainCanvas.width=t.imageBitmap.width,t.mainCanvas.height=t.imageBitmap.height,t.frameContext.drawImage(t.imageBitmap,0,0);const{validBlocks:i,blockHeight:n,blockWidth:s}=M(t.frameContext.getImageData(0,0,t.mainCanvas.width,t.mainCanvas.height),t.appProps.particleRadius);t.validBlocks=i,t.blockHeight=n,t.blockWidth=s,E=S({dimensions:{width:t.mainCanvas.width,height:t.mainCanvas.height}}),t.frameContext.clearRect(0,0,t.frameCanvas.width,t.frameCanvas.height);const l=t.frameCanvas.transferToImageBitmap();t.mainContext.transferFromImageBitmap(l),t.workerParticles=A({validBlocks:t.validBlocks,radius:t.appProps.particleRadius,blockHeight:t.blockHeight,blockWidth:t.blockWidth,startPosition:t.appProps.startPosition,delay:t.appProps.delay,animationDuration:t.appProps.animationDuration})}break}case p.UPDATE_ANIMATION_DURATION:{t.appProps.animationDuration=a,self.postMessage({type:m.UPDATE_APP_PROPS,data:t.appProps}),t.animationFrameId&&(t.bubbleParticles=[]);break}case p.UPDATE_ENABLE_BUBBLES:{t.appProps.enableBubbles=a,self.postMessage({type:m.UPDATE_APP_PROPS,data:t.appProps});break}case p.UPDATE_PARTICLE_SPREAD:{t.appProps.particleSpread=a,self.postMessage({type:m.UPDATE_APP_PROPS,data:t.appProps});break}case p.UPDATE_DELAY:{t.appProps.delay=a,t.workerParticles=A({validBlocks:t.validBlocks??new Uint8Array,radius:t.appProps.particleRadius,blockHeight:t.blockHeight,blockWidth:t.blockWidth,startPosition:t.appProps.startPosition,delay:t.appProps.delay,animationDuration:t.appProps.animationDuration}),self.postMessage({type:m.UPDATE_APP_PROPS,data:t.appProps});break}case p.UPDATE_START_PARTICLE_OPACITY:{if(t.appProps.startParticleOpacity=a,self.postMessage({type:m.UPDATE_APP_PROPS,data:t.appProps}),t.animationFrameId){cancelAnimationFrame(t.animationFrameId);const i=performance.now();f(i,i)}break}case p.UPDATE_END_PARTICLE_OPACITY:{if(t.appProps.endParticleOpacity=a,self.postMessage({type:m.UPDATE_APP_PROPS,data:t.appProps}),t.animationFrameId){cancelAnimationFrame(t.animationFrameId);const i=performance.now();f(i,i)}break}case p.UPDATE_START_PARTICLE_SIZE:{if(t.appProps.startParticleSize=a,self.postMessage({type:m.UPDATE_APP_PROPS,data:t.appProps}),t.animationFrameId){cancelAnimationFrame(t.animationFrameId);const i=performance.now();f(i,i)}break}case p.UPDATE_END_PARTICLE_SIZE:{if(t.appProps.endParticleSize=a,self.postMessage({type:m.UPDATE_APP_PROPS,data:t.appProps}),t.animationFrameId){cancelAnimationFrame(t.animationFrameId);const i=performance.now();f(i,i)}break}}}})();
