import { useCallback, useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { WorkerContext } from '../../contexts/WorkerContext';
import { Action } from '../../interfaces';
import './PulseColorSettings.css';

// Default values from the movement function
const DEFAULT_ANIMATION_DURATION = 3000;
const DEFAULT_PULSE_FREQUENCY_MIN = 3;
const DEFAULT_PULSE_FREQUENCY_MAX = 5;
const DEFAULT_SCALE_MAX_MULTIPLIER = 15;
const DEFAULT_SCALE_MIN_MULTIPLIER = 0.2;
const DEFAULT_COLOR_CYCLES = 2;
const DEFAULT_SATURATION = 100;
const DEFAULT_LIGHTNESS_BASE = 50;
const DEFAULT_LIGHTNESS_VARIATION = 30;
const DEFAULT_OPACITY_MIN = 0.4;
const DEFAULT_OPACITY_MAX = 1.0;

export const PulseColorSettings = () => {
  const worker = useContext(WorkerContext);
  const appProps = useContext(AppContext);

  const updateMovementCode = useCallback(
    (settings: Record<string, number>) => {
      if (!worker || !appProps?.movementFunctionCode) return;

      // Create an updated movement function with the new values
      const updatedCode = `
return (particle, animationStartTime, currentTime, canvasDimensions) => {
    const animationDuration = ${settings.animationDuration}; // milliseconds
    const progress = Math.min((currentTime - animationStartTime) / animationDuration, 1);

    // Initialize properties if not set
    if (!particle.hasInit) {
        particle.hasInit = true;
        particle.originalScale = particle.scale;
        particle.hueOffset = Math.random() * 360; // Random starting hue
        particle.pulseFrequency = ${settings.pulseFrequencyMin} + Math.random() * ${
        settings.pulseFrequencyMax - settings.pulseFrequencyMin
      }; // Individual pulse frequency
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

    // Dramatic scale pulsation
    const pulseWave = Math.sin(progress * Math.PI * particle.pulseFrequency);

    // Scale gets larger at pulse peaks
    if (pulseWave > 0) {
        // Exponential scale increase on positive pulses
        particle.scale = particle.originalScale * (1 + Math.pow(pulseWave, 2) * ${settings.scaleMaxMultiplier});
    } else {
        // Become small on negative pulses
        particle.scale = particle.originalScale * ${settings.scaleMinMultiplier};
    }

    // End at normal scale
    if (progress > 0.9) {
        const finalAdjustment = (progress - 0.9) / 0.1;
        particle.scale = particle.scale * (1 - finalAdjustment) + particle.originalScale * finalAdjustment;
    }

    // Color cycling through spectrum
    const hue = (particle.hueOffset + progress * (360 * ${settings.colorCycles})) % 360;
    const saturation = ${settings.saturation};
    const lightness = ${settings.lightnessBase} + ${settings.lightnessVariation} * pulseWave;

    particle.color = \`hsl(\${hue}, \${saturation}%, \${lightness}%)\`;

    // Opacity pulses oppositely to scale
    particle.opacity = ${settings.opacityMin} + ${
        settings.opacityMax - settings.opacityMin
      } * (1 - Math.abs(pulseWave));
}`;

      worker.postMessage({
        type: Action.UPDATE_SELECTED_MOVEMENT_FUNCTION,
        payload: {
          key: 'pulseColorCycle',
          movementFunctionCode: updatedCode,
        },
      });
    },
    [worker, appProps]
  );

  // Get current settings from local storage or use defaults
  const getCurrentSettings = useCallback(() => {
    try {
      const saved = localStorage.getItem('pulseColorSettings');
      return saved
        ? JSON.parse(saved)
        : {
            animationDuration: DEFAULT_ANIMATION_DURATION,
            pulseFrequencyMin: DEFAULT_PULSE_FREQUENCY_MIN,
            pulseFrequencyMax: DEFAULT_PULSE_FREQUENCY_MAX,
            scaleMaxMultiplier: DEFAULT_SCALE_MAX_MULTIPLIER,
            scaleMinMultiplier: DEFAULT_SCALE_MIN_MULTIPLIER,
            colorCycles: DEFAULT_COLOR_CYCLES,
            saturation: DEFAULT_SATURATION,
            lightnessBase: DEFAULT_LIGHTNESS_BASE,
            lightnessVariation: DEFAULT_LIGHTNESS_VARIATION,
            opacityMin: DEFAULT_OPACITY_MIN,
            opacityMax: DEFAULT_OPACITY_MAX,
          };
    } catch (e) {
      console.error('Error loading pulse color settings', e);
      return {
        animationDuration: DEFAULT_ANIMATION_DURATION,
        pulseFrequencyMin: DEFAULT_PULSE_FREQUENCY_MIN,
        pulseFrequencyMax: DEFAULT_PULSE_FREQUENCY_MAX,
        scaleMaxMultiplier: DEFAULT_SCALE_MAX_MULTIPLIER,
        scaleMinMultiplier: DEFAULT_SCALE_MIN_MULTIPLIER,
        colorCycles: DEFAULT_COLOR_CYCLES,
        saturation: DEFAULT_SATURATION,
        lightnessBase: DEFAULT_LIGHTNESS_BASE,
        lightnessVariation: DEFAULT_LIGHTNESS_VARIATION,
        opacityMin: DEFAULT_OPACITY_MIN,
        opacityMax: DEFAULT_OPACITY_MAX,
      };
    }
  }, []);

  const handleSettingChange = useCallback(
    (name: string, value: number) => {
      const settings = getCurrentSettings();
      settings[name] = value;
      localStorage.setItem('pulseColorSettings', JSON.stringify(settings));
      updateMovementCode(settings);
    },
    [getCurrentSettings, updateMovementCode]
  );

  const settings = getCurrentSettings();

  if (!appProps || appProps.selectedMovementFunction !== 'pulseColorCycle') {
    return null;
  }

  return (
    <div className="card">
      <span className="innerTitle">Pulse Color Settings</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="settingRow">
          <label>Animation Duration (ms):</label>
          <input
            type="range"
            min="500"
            max="10000"
            step="100"
            value={settings.animationDuration}
            onChange={(e) => handleSettingChange('animationDuration', Number(e.target.value))}
          />
          <span>{settings.animationDuration}ms</span>
        </div>

        <div className="settingRow">
          <label>Pulse Frequency:</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              min="0.5"
              max="10"
              step="0.1"
              style={{ width: '60px' }}
              value={settings.pulseFrequencyMin}
              onChange={(e) => handleSettingChange('pulseFrequencyMin', Number(e.target.value))}
            />
            <span>to</span>
            <input
              type="number"
              min="0.5"
              max="10"
              step="0.1"
              style={{ width: '60px' }}
              value={settings.pulseFrequencyMax}
              onChange={(e) => handleSettingChange('pulseFrequencyMax', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="settingRow">
          <label>Scale Range:</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span>Min:</span>
            <input
              type="number"
              min="0.1"
              max="1"
              step="0.05"
              style={{ width: '60px' }}
              value={settings.scaleMinMultiplier}
              onChange={(e) => handleSettingChange('scaleMinMultiplier', Number(e.target.value))}
            />
            <span>Max:</span>
            <input
              type="number"
              min="1"
              max="30"
              step="0.5"
              style={{ width: '60px' }}
              value={settings.scaleMaxMultiplier}
              onChange={(e) => handleSettingChange('scaleMaxMultiplier', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="settingRow">
          <label>Color Cycles:</label>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={settings.colorCycles}
            onChange={(e) => handleSettingChange('colorCycles', Number(e.target.value))}
          />
          <span>{settings.colorCycles}x</span>
        </div>

        <div className="settingRow">
          <label>Color Saturation:</label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={settings.saturation}
            onChange={(e) => handleSettingChange('saturation', Number(e.target.value))}
          />
          <span>{settings.saturation}%</span>
        </div>

        <div className="settingRow">
          <label>Lightness:</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span>Base:</span>
            <input
              type="number"
              min="0"
              max="100"
              step="5"
              style={{ width: '60px' }}
              value={settings.lightnessBase}
              onChange={(e) => handleSettingChange('lightnessBase', Number(e.target.value))}
            />
            <span>Variation:</span>
            <input
              type="number"
              min="0"
              max="50"
              step="5"
              style={{ width: '60px' }}
              value={settings.lightnessVariation}
              onChange={(e) => handleSettingChange('lightnessVariation', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="settingRow">
          <label>Opacity Range:</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span>Min:</span>
            <input
              type="number"
              min="0"
              max="1"
              step="0.05"
              style={{ width: '60px' }}
              value={settings.opacityMin}
              onChange={(e) => handleSettingChange('opacityMin', Number(e.target.value))}
            />
            <span>Max:</span>
            <input
              type="number"
              min="0"
              max="1"
              step="0.05"
              style={{ width: '60px' }}
              value={settings.opacityMax}
              onChange={(e) => handleSettingChange('opacityMax', Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
