import {useCallback, useContext, useMemo} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';
import {getSettingsConfig} from '../../settings-config';
// import {ParticleSizeEasingType} from '../../interfaces';

// const EASING_OPTIONS: Array<{value: ParticleSizeEasingType; label: string}> = [
//   {value: 'bell', label: 'Bell Curve'},
//   {value: 'linear', label: 'Linear'},
//   {value: 'multiPulse', label: 'Multi-Pulse'},
// ];

export const ParticleSize = () => {
  const appProps = useContext(AppContext);
  const workerActions = useWorkerActions();
  const {min: START_MIN, max: START_MAX, step: START_STEP} = useMemo(() => getSettingsConfig().startParticleSize, []);
  const {min: END_MIN, max: END_MAX, step: END_STEP} = useMemo(() => getSettingsConfig().endParticleSize, []);

  const handleSizeChange = useCallback((type: 'start' | 'end', value: number) => {
    if (type === 'start') {
      workerActions?.updateStartParticleSize(value);
    } else {
      workerActions?.updateEndParticleSize(value);
    }
  }, [workerActions]);

  // const handleEasingChange = useCallback((value: ParticleSizeEasingType) => {
  //   workerActions?.updateParticleSizeEasing(value);
  // }, [workerActions]);

  if (!appProps) {
    return null;
  }

  return (
    <>
      <div className="control-group">
        <label htmlFor="startParticleSize">Start Particle Size (px):</label>
        <div className="slider-input-group">
          <input
            type="range"
            min={START_MIN}
            max={START_MAX}
            step={START_STEP}
            value={appProps.startParticleSize}
            onChange={(e) => handleSizeChange('start', Number(e.target.value))}
          />
          <input
            type="number"
            min={START_MIN}
            max={START_MAX}
            step={START_STEP}
            value={appProps.startParticleSize}
            onChange={(e) => handleSizeChange('start', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="endParticleSize">End Particle Size (px):</label>
        <div className="slider-input-group">
          <input
            type="range"
            min={END_MIN}
            max={END_MAX}
            step={END_STEP}
            value={appProps.endParticleSize}
            onChange={(e) => handleSizeChange('end', Number(e.target.value))}
          />
          <input
            type="number"
            min={END_MIN}
            max={END_MAX}
            step={END_STEP}
            value={appProps.endParticleSize}
            onChange={(e) => handleSizeChange('end', Number(e.target.value))}
          />
        </div>
      </div>

      {/* <div className="control-group">
        <label htmlFor="particleSizeEasing">Size Easing Pattern:</label>
        <select
          id="particleSizeEasing"
          value={appProps.particleSizeEasing}
          onChange={(e) => handleEasingChange(e.target.value as ParticleSizeEasingType)}
        >
          {EASING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div> */}
    </>
  );
};
