import {useCallback, useContext} from 'react';
import {getUpdateAnimationDurationMessage} from '../../interfaces';
import {WorkerContext} from '../../contexts/WorkerContext';
import {AppContext} from '../../contexts/AppContext';
import {DEFAULT_ANIMATION_DURATION} from '../../constants';


export const AnimationDuration = () => {
  const worker = useContext(WorkerContext);
  const appProps = useContext(AppContext);
  const duration = appProps?.animationDuration ?? DEFAULT_ANIMATION_DURATION;

  const handleDurationChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const duration = parseInt(event.target.value, 10);
      if (worker && !isNaN(duration)) {
        worker.postMessage(getUpdateAnimationDurationMessage(duration));
      }
    },
    [worker]
  );


  return <div className="control-group">
    <label htmlFor="animationDuration">Animation Duration (ms):</label>
    <div className="slider-input-group">
      <input
        type="range"
        min="500"
        max="5000"
        step="100"
        value={duration}
        onChange={handleDurationChange}
      />
      <input
        type="number"
        min="500"
        max="5000"
        step="100"
        value={duration}
        onChange={handleDurationChange}
      />
    </div>
  </div>;
};
