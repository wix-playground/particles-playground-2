import {useCallback, useContext} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';

export const ParticleDelay = () => {
  const appProps = useContext(AppContext);
  const workerActions = useWorkerActions();

  const handleDelayChange = useCallback(
    (delay: number) => {
      workerActions?.updateDelay(delay);
    },
    [workerActions]
  );

  if (!appProps) {
    return;
  }


  return <div className="control-group">
    <label htmlFor="maxDelay">Max Particle Delay (ms):</label>
    <div className="slider-input-group">
      <input
        type="range"
        min="0"
        max="5000"
        step="50"
        value={appProps?.delay}
        onChange={(e) => handleDelayChange(Number(e.target.value))}
      />
      <input
        type="number"
        min="0"
        max="5000"
        value={appProps?.delay}
        onChange={(e) => handleDelayChange(Number(e.target.value))}
      />
    </div>
  </div>
};
