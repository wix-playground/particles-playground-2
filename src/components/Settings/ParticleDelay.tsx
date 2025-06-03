import {useCallback, useContext, useMemo} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';
import {MAX_ANIMATION_DURATION} from '../../constants';

const animationDelayOffset = 100;
const delayStep = 100;

export const ParticleDelay = () => {
  const appProps = useContext(AppContext);
  const workerActions = useWorkerActions();

  const handleDelayChange = useCallback(
    (delay: number) => {
      workerActions?.updateDelay(delay);
    },
    [workerActions]
  );

  const maxDelay = useMemo(() => (appProps?.animationDuration ?? MAX_ANIMATION_DURATION) - animationDelayOffset, [appProps?.animationDuration]);

  if (!appProps) {
    return;
  }



  return <div className="control-group">
    <label htmlFor="maxDelay">Max Particle Delay (ms):</label>
    <div className="slider-input-group">
      <input
        type="range"
        min="0"
        max={maxDelay}
        step={delayStep}
        value={appProps.delay}
        onChange={(e) => handleDelayChange(Number(e.target.value))}
      />
      <input
        type="number"
        min="0"
        max={maxDelay}
        value={appProps.delay}
        step={delayStep}
        onChange={(e) => handleDelayChange(Number(e.target.value))}
      />
    </div>
  </div>
};
