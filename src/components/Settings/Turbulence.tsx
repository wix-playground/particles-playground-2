import {useCallback, useContext, useMemo} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';
import {DEFAULT_TURBULENCE} from '../../constants';
import {getSettingsConfig} from '../../settings-config';

export const Turbulence = () => {
  const appProps = useContext(AppContext);
  const turbulence = appProps?.turbulence ?? DEFAULT_TURBULENCE;
  const workerActions = useWorkerActions();
  const {min: MIN_TURBULENCE, max: MAX_TURBULENCE, step: STEP} = useMemo(() => getSettingsConfig().turbulence, []);

  const handleUpdateTurbulence = useCallback(
    (turbulence: number) => {
      console.log('turbulence', turbulence);
      workerActions?.updateTurbulence(turbulence);
    },
    [workerActions]
  );

  if (!appProps) {
    return;
  }

  return <div className="control-group">
    <label htmlFor="turbulence">Effect Turbulence:</label>
    <div className="slider-input-group">
      <input
        type="range"
        min={MIN_TURBULENCE}
        max={MAX_TURBULENCE}
        step={STEP}
        value={turbulence}
        onChange={(e) => handleUpdateTurbulence(Number(e.target.value))}
      />
      <input
        type="number"
        min={MIN_TURBULENCE}
        max={MAX_TURBULENCE}
        step={STEP}
        value={turbulence}
        onChange={(e) => handleUpdateTurbulence(Number(e.target.value))}
      />
    </div>
  </div>;
};
