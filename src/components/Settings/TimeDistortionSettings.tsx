import {useCallback, useContext, useState} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {WorkerContext} from '../../contexts/WorkerContext';
import {Action} from '../../interfaces';
import './TimeDistortionSettings.css';

// Default values from the movement function
const DEFAULT_TIME_DILATION_MIN = 0.3;
const DEFAULT_TIME_DILATION_MAX = 1.7;
const DEFAULT_CHRONO_FIELD_MAX = 0.8;
const DEFAULT_TIME_REVERSAL_CHANCE = 0.2;
const DEFAULT_QUANTUM_FLUCTUATION_MAX = 0.5;
const DEFAULT_MAX_ECHOES_MIN = 5;
const DEFAULT_MAX_ECHOES_MAX = 10;
const DEFAULT_DISTORTION_STRENGTH = 15;
const DEFAULT_TEMPORAL_PHASE_MULTIPLIER = 4;

export const TimeDistortionSettings = () => {
  const worker = useContext(WorkerContext);
  const appProps = useContext(AppContext);

  // State for settings - no localStorage persistence
  const [settings, setSettings] = useState({
    timeDilationMin: DEFAULT_TIME_DILATION_MIN,
    timeDilationMax: DEFAULT_TIME_DILATION_MAX,
    chronoFieldMax: DEFAULT_CHRONO_FIELD_MAX,
    timeReversalChance: DEFAULT_TIME_REVERSAL_CHANCE,
    quantumFluctuationMax: DEFAULT_QUANTUM_FLUCTUATION_MAX,
    maxEchoesMin: DEFAULT_MAX_ECHOES_MIN,
    maxEchoesMax: DEFAULT_MAX_ECHOES_MAX,
    distortionStrength: DEFAULT_DISTORTION_STRENGTH,
    temporalPhaseMultiplier: DEFAULT_TEMPORAL_PHASE_MULTIPLIER,
  });

  const updateMovementCode = useCallback(
    (settings: Record<string, number>) => {
      if (!worker || !appProps?.movementFunctionCode) return;

      // Create an updated movement function with the new values
      const updatedCode = `
return (particle, animationStartTime, currentTime, canvasDimensions, animationDuration) => {
    const progress = Math.min((currentTime - animationStartTime) / animationDuration, 1);

    // Initialize properties if not set
    if (!particle.hasInit) {
        particle.hasInit = true;
        particle.originalScale = particle.scale;
        particle.timeDialation = ${settings.timeDilationMin} + Math.random() * ${settings.timeDilationMax - settings.timeDilationMin}; // How fast/slow time moves for this particle
        particle.temporalPhase = Math.random() * Math.PI * 2; // Phase in time wave
        particle.chronoField = Math.random() * ${settings.chronoFieldMax}; // Strength of temporal field
        particle.timeReversal = Math.random() > ${1 - settings.timeReversalChance}; // Chance of time reversal
        particle.quantumFluctuation = Math.random() * ${settings.quantumFluctuationMax}; // Quantum time uncertainty
        particle.lastPosition = {x: particle.initialX, y: particle.initialY};
        particle.timeEcho = []; // Trail of previous positions
        particle.maxEchos = ${settings.maxEchoesMin} + Math.floor(Math.random() * ${settings.maxEchoesMax - settings.maxEchoesMin});
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
    const timeWave = Math.sin(progress * Math.PI * ${settings.temporalPhaseMultiplier} + particle.temporalPhase);
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
        const distortion = Math.sin(distortionAngle) * fieldStrength * ${settings.distortionStrength};

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

      worker.postMessage({
        type: Action.UPDATE_SELECTED_MOVEMENT_FUNCTION,
        payload: {
          key: 'timeDistortion',
          movementFunctionCode: updatedCode,
        },
      });
    },
    [worker, appProps]
  );

  const handleSettingChange = useCallback(
    (name: string, value: number) => {
      const newSettings = {...settings, [name]: value};
      setSettings(newSettings);
      updateMovementCode(newSettings);
    },
    [settings, updateMovementCode]
  );

  if (!appProps || appProps.selectedMovementFunction !== 'timeDistortion') {
    return null;
  }

  return (
    <div className="card">
      <span className="innerTitle">Time Distortion Settings</span>
      <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>

        <div className="settingRow">
          <label>Time Dilation Range:</label>
          <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
            <span>Min:</span>
            <input
              type="number"
              min="0.1"
              max="2"
              step="0.1"
              style={{width: '60px'}}
              value={settings.timeDilationMin}
              onChange={(e) => handleSettingChange('timeDilationMin', Number(e.target.value))}
            />
            <span>Max:</span>
            <input
              type="number"
              min="0.1"
              max="3"
              step="0.1"
              style={{width: '60px'}}
              value={settings.timeDilationMax}
              onChange={(e) => handleSettingChange('timeDilationMax', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="settingRow">
          <label>Chrono Field Strength:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.chronoFieldMax}
            onChange={(e) => handleSettingChange('chronoFieldMax', Number(e.target.value))}
          />
          <span>{(settings.chronoFieldMax * 100).toFixed(0)}%</span>
        </div>

        <div className="settingRow">
          <label>Time Reversal Chance:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.timeReversalChance}
            onChange={(e) => handleSettingChange('timeReversalChance', Number(e.target.value))}
          />
          <span>{(settings.timeReversalChance * 100).toFixed(0)}%</span>
        </div>

        <div className="settingRow">
          <label>Quantum Fluctuation:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.quantumFluctuationMax}
            onChange={(e) => handleSettingChange('quantumFluctuationMax', Number(e.target.value))}
          />
          <span>{(settings.quantumFluctuationMax * 100).toFixed(0)}%</span>
        </div>

        <div className="settingRow">
          <label>Time Echo Count:</label>
          <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
            <span>Min:</span>
            <input
              type="number"
              min="1"
              max="15"
              step="1"
              style={{width: '60px'}}
              value={settings.maxEchoesMin}
              onChange={(e) => handleSettingChange('maxEchoesMin', Number(e.target.value))}
            />
            <span>Max:</span>
            <input
              type="number"
              min="1"
              max="20"
              step="1"
              style={{width: '60px'}}
              value={settings.maxEchoesMax}
              onChange={(e) => handleSettingChange('maxEchoesMax', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="settingRow">
          <label>Distortion Strength:</label>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={settings.distortionStrength}
            onChange={(e) => handleSettingChange('distortionStrength', Number(e.target.value))}
          />
          <span>{settings.distortionStrength}</span>
        </div>

        <div className="settingRow">
          <label>Temporal Phase Speed:</label>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={settings.temporalPhaseMultiplier}
            onChange={(e) => handleSettingChange('temporalPhaseMultiplier', Number(e.target.value))}
          />
          <span>{settings.temporalPhaseMultiplier}x</span>
        </div>
      </div>
    </div>
  );
};
