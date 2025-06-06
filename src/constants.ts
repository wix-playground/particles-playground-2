import {FontState, StartPositionType, ParticleSizeEasingType, ParticleOpacityEasingType, AppProps} from './interfaces';

export const DEFAULT_PARTICLE_RADIUS = 5;
export const DEFAULT_PARTICLE_SPREAD = 3;
export const DEFAULT_DELAY = 0;
export const DEFAULT_ANIMATION_DURATION = 3000;
export const MAX_ANIMATION_DURATION = 5000;
export const DEFAULT_START_PARTICLE_OPACITY = 1.0;
export const DEFAULT_END_PARTICLE_OPACITY = 1.0;
export const DEFAULT_START_PARTICLE_SIZE = 5.0;
export const DEFAULT_END_PARTICLE_SIZE = 1.0;
export const DEFAULT_PARTICLE_SIZE_EASING: ParticleSizeEasingType = 'linear';
export const DEFAULT_PARTICLE_OPACITY_EASING: ParticleOpacityEasingType = 'linear';
export const DEFAULT_START_POSITION: StartPositionType = 'random';
export const DEFAULT_MOVEMENT_FUNCTION_KEY = 'backInOut';
export const DEFAULT_DARK_THEME_COLOR = '#FFFFFF';
export const DEFAULT_LIGHT_THEME_COLOR = '#213547';
export const DEFAULT_PARTICLES_TEXT = 'WIX 🤠\nParticles!';
export const DEFAULT_PARTICLE_COLOR = '#ffffff';
export const DEFAULT_PARTICLE_COLORS = ['#ff0000', '#00ff00', '#0000ff'];
export const DEFAULT_ENABLE_REVEAL_ANIMATION = false;
export const DEFAULT_REVEAL_DIRECTION = 0; // 0 degrees = left-to-right
export const DEFAULT_TURBULENCE = 0.8;
export const DEFAULT_WIND_SPEED = 1.0;
export const DEFAULT_WIND_DIRECTION = 0; // 0 degrees (right direction)
export const DEFAULT_FONT_STATE: FontState = {
    fontFamily: 'Arial',
    fontSize: 64,
    italic: false,
    weight: 600,
}

export const COPY_AI_PROMPT_TEXT = 'Copy AI prompt';
export const AI_PROMPT_TOOLTIP_TEXT =
    'Copy an AI friendly prompt to your clipboard and run it on a LLM to receive an AI generated movement function.';
export const COPIED_TEXT = 'Copied!';
export const COPY_ERROR_TEXT = 'Copy error, try again';

export const COPY_SHAREABLE_LINK_TEXT = 'Copy shareable link';
export const GENERATING_LINK_TEXT = 'Generating link...';

export const SNIPPET_QUERY_PARAM = 'snippet';

export const DEV_EXAMPLE_CODE = `// This function will be called twice for each particle, because all particles reach the target in two frames.
return (particle, animationStartTime, currentTime, canvasDimensions) => {
    if (particle.x === 0 && particle.y === 0) {
        particle.x = particle.targetX;
        particle.y = particle.targetY;
    } else {
        particle.x = 0
        particle.y = 0
    }
}`;

export const EXAMPLE_JSDOC = `/**
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
`

export const EXAMPLE_CODE = `${EXAMPLE_JSDOC}
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
}`;

export const EXAMPLE_AI_PROMPT = `Write another function using the contract like this one with interesting animation. Make sure the all of the particles reach the target within the animation duration. You don't need to write JSDOC.:
${EXAMPLE_CODE}`;

export const DATA_TEST_IDS = {
    FONT_FAMILY_SELECT: 'font-family-select',
    FONT_WEIGHT_SELECT: 'font-weight-select',
    FONT_SIZE_INPUT: 'font-size-input',
    FONT_ITALIC_CHECKBOX: 'font-italic-checkbox',
    TEXT_INPUT: 'text-input',
}

// New emitter defaults
export const DEFAULT_EMITTER_X = 500;
export const DEFAULT_EMITTER_Y = 300;
export const DEFAULT_EMITTER_SIZE = 100;
export const DEFAULT_EMITTER_ANGLE = 0;

export const EFFECT_PARTICLE_MAX_LIFETIME = 1000;
export const EFFECT_PARTICLE_MIN_LIFETIME = 500;
export const DEFAULT_MAX_EFFECT_PARTICLE_LIFETIME = 1000;
export const DEFAULT_TEXT_COLOR = '#FFFFFF';
export const DEFAULT_MIN_EFFECT_PARTICLES = 3;
export const DEFAULT_MAX_EFFECT_PARTICLES = 5;


export const DEFAULT_APP_PROPS: AppProps = {
    particleRadius: DEFAULT_PARTICLE_RADIUS,
    startPosition: DEFAULT_START_POSITION,
    selectedMovementFunction: DEFAULT_MOVEMENT_FUNCTION_KEY,
    text: DEFAULT_PARTICLES_TEXT,
    textColor: DEFAULT_TEXT_COLOR,
    font: DEFAULT_FONT_STATE,
    particleColors: DEFAULT_PARTICLE_COLORS,
    animationDuration: DEFAULT_ANIMATION_DURATION,
    particleSpread: DEFAULT_PARTICLE_SPREAD,
    startParticleOpacity: DEFAULT_START_PARTICLE_OPACITY,
    endParticleOpacity: DEFAULT_END_PARTICLE_OPACITY,
    startParticleSize: DEFAULT_START_PARTICLE_SIZE,
    endParticleSize: DEFAULT_END_PARTICLE_SIZE,
    particleSizeEasing: DEFAULT_PARTICLE_SIZE_EASING,
    particleOpacityEasing: DEFAULT_PARTICLE_OPACITY_EASING,
    delay: DEFAULT_DELAY,
    emitterX: DEFAULT_EMITTER_X,
    emitterY: DEFAULT_EMITTER_Y,
    emitterSize: DEFAULT_EMITTER_SIZE,
    emitterAngle: DEFAULT_EMITTER_ANGLE,
    enableRevealAnimation: DEFAULT_ENABLE_REVEAL_ANIMATION,
    revealDirection: DEFAULT_REVEAL_DIRECTION,
    turbulence: DEFAULT_TURBULENCE,
    windSpeed: DEFAULT_WIND_SPEED,
    windDirection: DEFAULT_WIND_DIRECTION,
    maxEffectParticleLifetime: DEFAULT_MAX_EFFECT_PARTICLE_LIFETIME,
    minEffectParticles: DEFAULT_MIN_EFFECT_PARTICLES,
    maxEffectParticles: DEFAULT_MAX_EFFECT_PARTICLES,
};
