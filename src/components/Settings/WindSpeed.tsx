import {useCallback, useContext, useMemo} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';
import {DEFAULT_WIND_SPEED} from '../../constants';
import {getSettingsConfig} from '../../settings-config';

export const WindSpeed = () => {
  const appProps = useContext(AppContext);
  const windSpeed = appProps?.windSpeed ?? DEFAULT_WIND_SPEED;
  const workerActions = useWorkerActions();
  const {min: MIN_WIND_SPEED, max: MAX_WIND_SPEED, step: STEP} = useMemo(() => getSettingsConfig().windSpeed, []);

  const handleUpdateWindSpeed = useCallback(
    (windSpeed: number) => {
      workerActions?.updateWindSpeed(windSpeed);
    },
    [workerActions]
  );

  if (!appProps) {
    return;
  }

  return <div className="control-group">
    <label htmlFor="windSpeed">Effect Wind Speed:</label>
    <div className="slider-input-group">
      <input
        type="range"
        min={MIN_WIND_SPEED}
        max={MAX_WIND_SPEED}
        step={STEP}
        value={windSpeed}
        onChange={(e) => handleUpdateWindSpeed(Number(e.target.value))}
      />
      <input
        type="number"
        min={MIN_WIND_SPEED}
        max={MAX_WIND_SPEED}
        step={STEP}
        value={windSpeed}
        onChange={(e) => handleUpdateWindSpeed(Number(e.target.value))}
      />
    </div>
  </div>;
};
