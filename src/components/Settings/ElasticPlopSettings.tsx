import {useCallback, useContext, useState} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';
import './ElasticPlopSettings.css';

// Default values from the movement function
const DEFAULT_ELASTICITY_MIN = 0.6;
const DEFAULT_ELASTICITY_MAX = 0.9;
const DEFAULT_DAMPING_MIN = 0.95;
const DEFAULT_DAMPING_MAX = 0.99;
const DEFAULT_INITIAL_VELOCITY = 480;
const DEFAULT_BOUNCE_COOLDOWN = 50;
const DEFAULT_BARRIER_DETECTION_DISTANCE = 15;
const DEFAULT_ATTRACTION_BASE = 60;
const DEFAULT_ATTRACTION_PROGRESSION = 180;
const DEFAULT_SPEED_SCALE_MULTIPLIER = 0.0001;
const DEFAULT_BOUNCE_SCALE_MULTIPLIER = 0.1;
const DEFAULT_ENERGY_HUE_MULTIPLIER = 0.5;
const DEFAULT_BOUNCE_HUE_STEP = 60;
const DEFAULT_BASE_SATURATION = 70;
const DEFAULT_SPEED_SATURATION_MULTIPLIER = 0.01;
const DEFAULT_BASE_LIGHTNESS = 40;
const DEFAULT_SPEED_LIGHTNESS_MULTIPLIER = 0.008;
const DEFAULT_BASE_OPACITY = 0.5;
const DEFAULT_SPEED_OPACITY_MULTIPLIER = 0.002;
const DEFAULT_TRAIL_INTENSITY_MULTIPLIER = 0.2;
const DEFAULT_TRAIL_BASE_OPACITY = 0.3;
const DEFAULT_TRAIL_OPACITY_MULTIPLIER = 0.7;

export const ElasticPlopSettings = () => {
  const workerActions = useWorkerActions();
  const appProps = useContext(AppContext);

  const [settings, setSettings] = useState({
    elasticityMin: DEFAULT_ELASTICITY_MIN,
    elasticityMax: DEFAULT_ELASTICITY_MAX,
    dampingMin: DEFAULT_DAMPING_MIN,
    dampingMax: DEFAULT_DAMPING_MAX,
    initialVelocity: DEFAULT_INITIAL_VELOCITY,
    bounceCooldown: DEFAULT_BOUNCE_COOLDOWN,
    barrierDetectionDistance: DEFAULT_BARRIER_DETECTION_DISTANCE,
    attractionBase: DEFAULT_ATTRACTION_BASE,
    attractionProgression: DEFAULT_ATTRACTION_PROGRESSION,
    speedScaleMultiplier: DEFAULT_SPEED_SCALE_MULTIPLIER,
    bounceScaleMultiplier: DEFAULT_BOUNCE_SCALE_MULTIPLIER,
    energyHueMultiplier: DEFAULT_ENERGY_HUE_MULTIPLIER,
    bounceHueStep: DEFAULT_BOUNCE_HUE_STEP,
    baseSaturation: DEFAULT_BASE_SATURATION,
    speedSaturationMultiplier: DEFAULT_SPEED_SATURATION_MULTIPLIER,
    baseLightness: DEFAULT_BASE_LIGHTNESS,
    speedLightnessMultiplier: DEFAULT_SPEED_LIGHTNESS_MULTIPLIER,
    baseOpacity: DEFAULT_BASE_OPACITY,
    speedOpacityMultiplier: DEFAULT_SPEED_OPACITY_MULTIPLIER,
    trailIntensityMultiplier: DEFAULT_TRAIL_INTENSITY_MULTIPLIER,
    trailBaseOpacity: DEFAULT_TRAIL_BASE_OPACITY,
    trailOpacityMultiplier: DEFAULT_TRAIL_OPACITY_MULTIPLIER,
  });

  const updateMovementCode = useCallback((newSettings: typeof settings) => {
    const elasticPlopMovementString = `return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
    const progress = Math.min((currentTime - animationStartTime) / animationDuration, 1);

    // Initialize elastic properties
    if (!particle.hasInit) {
        particle.hasInit = true;
        particle.elasticity = ${newSettings.elasticityMin} + Math.random() * (${newSettings.elasticityMax} - ${newSettings.elasticityMin}); // Bounce factor
        particle.damping = ${newSettings.dampingMin} + Math.random() * (${newSettings.dampingMax} - ${newSettings.dampingMin}); // Energy loss per bounce
        particle.bounceCount = 0;
        particle.originalScale = particle.scale;
        particle.lastUpdateTime = animationStartTime;

        // Calculate initial velocity toward target (pixels per second)
        const dx = particle.targetX - particle.initialX;
        const dy = particle.targetY - particle.initialY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        particle.velocityX = (dx / distance) * ${newSettings.initialVelocity}; // pixels per second
        particle.velocityY = (dy / distance) * ${newSettings.initialVelocity}; // pixels per second

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
            const cooldownDuration = ${newSettings.bounceCooldown}; // ms cooldown

            if (distanceToBarrier < ${newSettings.barrierDetectionDistance} && (!particle.bounceCooldown[bounceKey] || currentTime - particle.bounceCooldown[bounceKey] > cooldownDuration)) {
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
            const attractionStrength = (${newSettings.attractionBase} + (progress * ${newSettings.attractionProgression})) * deltaTime; // Time-based acceleration
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
    const speedScale = 1 + speed * ${newSettings.speedScaleMultiplier};
    const bounceScale = 1 + particle.bounceCount * ${newSettings.bounceScaleMultiplier};
    particle.scale = Math.max(particle.originalScale * (speedScale * bounceScale) / 4, 1);

    // Color changes with energy (speed) and bounce count
    const energyHue = Math.min(speed * ${newSettings.energyHueMultiplier}, 120);
    const bounceHue = (particle.bounceCount * ${newSettings.bounceHueStep}) % 360;
    const hue = (energyHue + bounceHue) % 360;
    const saturation = ${newSettings.baseSaturation} + Math.min(speed * ${newSettings.speedSaturationMultiplier}, 30);
    const lightness = ${newSettings.baseLightness} + Math.min(speed * ${newSettings.speedLightnessMultiplier}, 40);

    particle.color = \`hsl(\${hue}, \${saturation}%, \${lightness}%)\`;

    // Opacity based on energy
    particle.opacity = ${newSettings.baseOpacity} + Math.min(speed * ${newSettings.speedOpacityMultiplier}, 0.5);

    // Trail effect after bounces
    if (particle.bounceCount > 0) {
        const trailIntensity = Math.min(particle.bounceCount * ${newSettings.trailIntensityMultiplier}, 1);
        particle.opacity = Math.max(particle.opacity, ${newSettings.trailBaseOpacity} + trailIntensity * ${newSettings.trailOpacityMultiplier});
    }
};`;

    if (workerActions) {
      workerActions.updateSelectedMovementFunction({
        key: 'elasticPlop',
        movementFunctionCode: `/**
 * @param particle - The particle object to animate
 * @param animationStartTime - The time when the animation started
 * @param currentTime - The current time
 * @param canvasDimensions - The dimensions of the canvas
 * @param animationDuration - The total duration of the animation
 */
${elasticPlopMovementString}`,
      });
    }
  }, [workerActions]);

  const handleSettingChange = useCallback((key: keyof typeof settings, value: number) => {
    const newSettings = {...settings, [key]: value};
    setSettings(newSettings);
    updateMovementCode(newSettings);
  }, [settings, updateMovementCode]);

  if (appProps?.selectedMovementFunction !== 'elasticPlop') {
    return null;
  }

  return (
    <div className="card">
      <span className="innerTitle">Elastic Plop Settings</span>
      <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>

        {/* Physics Settings */}
        <div className="settingSection">
          <span className="sectionTitle">Physics</span>

          <div className="settingRow">
            <label>Elasticity Range:</label>
            <div className="rangeGroup">
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={settings.elasticityMin}
                onChange={(e) => handleSettingChange('elasticityMin', parseFloat(e.target.value))}
              />
              <span>{settings.elasticityMin.toFixed(2)}</span>
              <span>to</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={settings.elasticityMax}
                onChange={(e) => handleSettingChange('elasticityMax', parseFloat(e.target.value))}
              />
              <span>{settings.elasticityMax.toFixed(2)}</span>
            </div>
          </div>

          <div className="settingRow">
            <label>Damping Range:</label>
            <div className="rangeGroup">
              <input
                type="range"
                min="0.8"
                max="1.0"
                step="0.01"
                value={settings.dampingMin}
                onChange={(e) => handleSettingChange('dampingMin', parseFloat(e.target.value))}
              />
              <span>{settings.dampingMin.toFixed(2)}</span>
              <span>to</span>
              <input
                type="range"
                min="0.8"
                max="1.0"
                step="0.01"
                value={settings.dampingMax}
                onChange={(e) => handleSettingChange('dampingMax', parseFloat(e.target.value))}
              />
              <span>{settings.dampingMax.toFixed(2)}</span>
            </div>
          </div>

          <div className="settingRow">
            <label>Initial Velocity:</label>
            <input
              type="range"
              min="100"
              max="1000"
              step="20"
              value={settings.initialVelocity}
              onChange={(e) => handleSettingChange('initialVelocity', parseInt(e.target.value))}
            />
            <span>{settings.initialVelocity} px/s</span>
          </div>
        </div>

        {/* Collision Settings */}
        <div className="settingSection">
          <span className="sectionTitle">Collision</span>

          <div className="settingRow">
            <label>Bounce Cooldown:</label>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={settings.bounceCooldown}
              onChange={(e) => handleSettingChange('bounceCooldown', parseInt(e.target.value))}
            />
            <span>{settings.bounceCooldown} ms</span>
          </div>

          <div className="settingRow">
            <label>Detection Distance:</label>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={settings.barrierDetectionDistance}
              onChange={(e) => handleSettingChange('barrierDetectionDistance', parseInt(e.target.value))}
            />
            <span>{settings.barrierDetectionDistance} px</span>
          </div>
        </div>

        {/* Attraction Settings */}
        <div className="settingSection">
          <span className="sectionTitle">Target Attraction</span>

          <div className="settingRow">
            <label>Base Attraction:</label>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={settings.attractionBase}
              onChange={(e) => handleSettingChange('attractionBase', parseInt(e.target.value))}
            />
            <span>{settings.attractionBase}</span>
          </div>

          <div className="settingRow">
            <label>Progression Multiplier:</label>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={settings.attractionProgression}
              onChange={(e) => handleSettingChange('attractionProgression', parseInt(e.target.value))}
            />
            <span>{settings.attractionProgression}</span>
          </div>
        </div>

        {/* Visual Effects Settings */}
        <div className="settingSection">
          <span className="sectionTitle">Visual Effects</span>

          <div className="settingRow">
            <label>Speed Scale Effect:</label>
            <input
              type="range"
              min="0.00001"
              max="0.001"
              step="0.00001"
              value={settings.speedScaleMultiplier}
              onChange={(e) => handleSettingChange('speedScaleMultiplier', parseFloat(e.target.value))}
            />
            <span>{settings.speedScaleMultiplier.toFixed(5)}</span>
          </div>

          <div className="settingRow">
            <label>Bounce Scale Effect:</label>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={settings.bounceScaleMultiplier}
              onChange={(e) => handleSettingChange('bounceScaleMultiplier', parseFloat(e.target.value))}
            />
            <span>{settings.bounceScaleMultiplier.toFixed(2)}</span>
          </div>

          <div className="settingRow">
            <label>Trail Intensity:</label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={settings.trailIntensityMultiplier}
              onChange={(e) => handleSettingChange('trailIntensityMultiplier', parseFloat(e.target.value))}
            />
            <span>{settings.trailIntensityMultiplier.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
