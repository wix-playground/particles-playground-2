import {useCallback, useContext, useMemo} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';
import {getSettingsConfig} from '../../settings-config';

export const ParticleDelay = () => {
  const appProps = useContext(AppContext);
  const workerActions = useWorkerActions();
  const {min: MIN_DELAY, max: MAX_DELAY, step: STEP} = useMemo(() => getSettingsConfig().delay, []);

  const handleDelayChange = useCallback(
    (delay: number) => {
      workerActions?.updateDelay(delay);
    },
    [workerActions]
  );

  // Calculate max delay based on animation duration, but don't exceed the config max
  const maxDelay = useMemo(() => {
    const animationBasedMax = (appProps?.animationDuration ?? 5000) - 100;
    return Math.min(animationBasedMax, MAX_DELAY);
  }, [appProps?.animationDuration, MAX_DELAY]);

  if (!appProps) {
    return;
  }

  return <div className="control-group">
    <label htmlFor="maxDelay">Max Particle Delay (ms):</label>
    <div className="slider-input-group">
      <input
        type="range"
        min={MIN_DELAY}
        max={maxDelay}
        step={STEP}
        value={appProps.delay}
        onChange={(e) => handleDelayChange(Number(e.target.value))}
      />
      <input
        type="number"
        min={MIN_DELAY}
        max={maxDelay}
        value={appProps.delay}
        step={STEP}
        onChange={(e) => handleDelayChange(Number(e.target.value))}
      />
    </div>
  </div>
};
