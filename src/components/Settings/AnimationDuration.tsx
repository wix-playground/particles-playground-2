import {useCallback, useContext} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {DEFAULT_ANIMATION_DURATION, MAX_ANIMATION_DURATION} from '../../constants';
import {useWorkerActions} from '../../hooks/useWorkerActions';


export const AnimationDuration = () => {
  const workerActions = useWorkerActions();
  const appProps = useContext(AppContext);
  const duration = appProps?.animationDuration ?? DEFAULT_ANIMATION_DURATION;

  const handleDurationChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const duration = parseInt(event.target.value, 10);
      if (workerActions && !isNaN(duration)) {
        workerActions.updateAnimationDuration(duration);
      }
    },
    [workerActions]
  );


  return <div className="control-group">
    <label htmlFor="animationDuration">Animation Duration (ms):</label>
    <div className="slider-input-group">
      <input
        type="range"
        min="500"
        max={MAX_ANIMATION_DURATION}
        step="100"
        value={duration}
        onChange={handleDurationChange}
      />
      <input
        type="number"
        min="500"
        max={MAX_ANIMATION_DURATION}
        step="100"
        value={duration}
        onChange={handleDurationChange}
      />
    </div>
  </div>;
};
