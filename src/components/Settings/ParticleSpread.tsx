import {useCallback, useContext} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';
import {DEFAULT_PARTICLE_SPREAD} from '../../constants';

const MIN_SPREAD = 1;
const MAX_SPREAD = 5;

export const ParticleSpread = () => {
  const appProps = useContext(AppContext);
  const particleSpread = appProps?.particleSpread || DEFAULT_PARTICLE_SPREAD;
  const workerActions = useWorkerActions();

  const handleUpdateSpread = useCallback(
    (spread: number) => {
      workerActions?.updateParticleSpread(spread);
    },
    [workerActions]
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
