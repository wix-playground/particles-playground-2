import {useCallback, useContext} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';
import {ParticleOpacityEasingType} from '../../interfaces';

const EASING_OPTIONS: Array<{value: ParticleOpacityEasingType; label: string}> = [
  {value: 'bell', label: 'Bell Curve'},
  {value: 'linear', label: 'Linear'},
  {value: 'multiPulse', label: 'Multi-Pulse'},
];

export const ParticleOpacity = () => {
  const appProps = useContext(AppContext);
  const workerActions = useWorkerActions();

  const handleOpacityChange = useCallback((type: 'start' | 'end', value: number) => {
    if (type === 'start') {
      workerActions?.updateStartParticleOpacity(value);
    } else {
      workerActions?.updateEndParticleOpacity(value);
    }
  }, [workerActions]);

  const handleEasingChange = useCallback((value: ParticleOpacityEasingType) => {
    workerActions?.updateParticleOpacityEasing(value);
  }, [workerActions]);

  if (!appProps) {
    return null;
  }

  return (
    <>
      <div className="control-group">
        <label htmlFor="startParticleOpacity">Start Particle Opacity (0-1):</label>
        <div className="slider-input-group">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={appProps.startParticleOpacity}
            onChange={(e) => handleOpacityChange('start', Number(e.target.value))}
          />
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={appProps.startParticleOpacity}
            onChange={(e) => handleOpacityChange('start', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="endParticleOpacity">End Particle Opacity (0-1):</label>
        <div className="slider-input-group">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={appProps.endParticleOpacity}
            onChange={(e) => handleOpacityChange('end', Number(e.target.value))}
          />
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={appProps.endParticleOpacity}
            onChange={(e) => handleOpacityChange('end', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="particleOpacityEasing">Opacity Easing Pattern:</label>
        <select
          id="particleOpacityEasing"
          value={appProps.particleOpacityEasing}
          onChange={(e) => handleEasingChange(e.target.value as ParticleOpacityEasingType)}
        >
          {EASING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};
