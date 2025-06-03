import {useCallback, useContext} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';
// import {ParticleSizeEasingType} from '../../interfaces';

const STEP = 0.5;
const MIN = 0.5;
const MAX = 10;

// const EASING_OPTIONS: Array<{value: ParticleSizeEasingType; label: string}> = [
//   {value: 'bell', label: 'Bell Curve'},
//   {value: 'linear', label: 'Linear'},
//   {value: 'multiPulse', label: 'Multi-Pulse'},
// ];

export const ParticleSize = () => {
  const appProps = useContext(AppContext);
  const workerActions = useWorkerActions();

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
            min={MIN}
            max={MAX}
            step={STEP}
            value={appProps.startParticleSize}
            onChange={(e) => handleSizeChange('start', Number(e.target.value))}
          />
          <input
            type="number"
            min={MIN}
            max={MAX}
            step={STEP}
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
            min={MIN}
            max={MAX}
            step={STEP}
            value={appProps.endParticleSize}
            onChange={(e) => handleSizeChange('end', Number(e.target.value))}
          />
          <input
            type="number"
            min={MIN}
            max={MAX}
            step={STEP}
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
