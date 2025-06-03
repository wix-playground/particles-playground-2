import {useCallback, useContext, useMemo} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';
import {getSettingsConfig} from '../../settings-config';

export const ParticleDensity = () => {
  const appProps = useContext(AppContext);
  const workerActions = useWorkerActions();
  const {min: MIN_RADIUS, max: MAX_RADIUS, step: STEP} = useMemo(() => getSettingsConfig().particleRadius, []);

  const particleRadius = appProps?.particleRadius || MIN_RADIUS;

  const getParticleRadius = useCallback((density: number) => {
    return Math.max(MIN_RADIUS, MAX_RADIUS - density);
  }, [MIN_RADIUS, MAX_RADIUS]);

  const calculatedDensity = Math.max(1, MAX_RADIUS - particleRadius);

  const handleUpdateDensity = useCallback(
    (density: number) => {
      workerActions?.updateParticleRadius(getParticleRadius(density));
    },
    [workerActions, getParticleRadius]
  );

  if (!appProps) {
    return;
  }

  return <div className="control-group">
    <label htmlFor="particleDensity">Particle Density:</label>
    <div className="slider-input-group">
      <input
        type="range"
        min={MIN_RADIUS}
        max={MAX_RADIUS - 1}
        step={STEP}
        value={calculatedDensity}
        onChange={(e) => handleUpdateDensity(Number(e.target.value))}
      />
      <input
        type="number"
        min={MIN_RADIUS}
        max={MAX_RADIUS - 1}
        step={STEP}
        value={calculatedDensity}
        onChange={(e) => handleUpdateDensity(Number(e.target.value))}
      />
    </div>
  </div>;
};
