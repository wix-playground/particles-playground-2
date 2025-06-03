import {useCallback, useContext} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {WorkerContext} from '../../contexts/WorkerContext';
import {getUpdateStartParticleSizeMessage, getUpdateEndParticleSizeMessage} from '../../interfaces';

const STEP = 0.5;
const MIN = 0.5;
const MAX = 10;

export const ParticleSize = () => {
  const appProps = useContext(AppContext);
  const worker = useContext(WorkerContext);

  const handleSizeChange = useCallback((type: 'start' | 'end', value: number) => {
    if (!worker) return;

    if (type === 'start') {
      worker.postMessage(getUpdateStartParticleSizeMessage(value));
    } else {
      worker.postMessage(getUpdateEndParticleSizeMessage(value));
    }
  }, [worker]);

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
    </>
  );
};
