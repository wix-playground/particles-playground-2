import {useCallback, useContext} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {WorkerContext} from '../../contexts/WorkerContext';
import {getUpdateParticleSpreadMessage} from '../../interfaces';
import {DEFAULT_PARTICLE_SPREAD} from '../../constants';

const MIN_SPREAD = 1;
const MAX_SPREAD = 5;

export const ParticleSpread = () => {
  const appProps = useContext(AppContext);
  const particleSpread = appProps?.particleSpread || DEFAULT_PARTICLE_SPREAD;
  const worker = useContext(WorkerContext);

  const handleUpdateSpread = useCallback(
    (spread: number) => {
      if (worker) worker.postMessage(getUpdateParticleSpreadMessage(spread));
    },
    [worker]
  );

  if (!appProps) {
    return;
  }

  return <div className="control-group">
    <label htmlFor="particleSpread">Particle Spread:</label>
    <div className="slider-input-group">
      <input
        type="range"
        min={MIN_SPREAD}
        max={MAX_SPREAD}
        step="0.5"
        value={particleSpread}
        onChange={(e) => handleUpdateSpread(Number(e.target.value))}
      />
      <input
        type="number"
        min={MIN_SPREAD}
        max={MAX_SPREAD}
        step="0.5"
        value={particleSpread}
        onChange={(e) => handleUpdateSpread(Number(e.target.value))}
      />
    </div>
  </div>;
};
