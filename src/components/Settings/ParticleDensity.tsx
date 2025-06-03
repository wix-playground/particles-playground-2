import {useCallback, useContext} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';

const MAX_DENSITY = 10;
const MIN_DENSITY = 1;
export const ParticleDensity = () => {
  const appProps = useContext(AppContext);
  const particleRadius = appProps?.particleRadius || MIN_DENSITY;

  const getParticleRadius = useCallback((density: number) => {
    return Math.max(MIN_DENSITY, MAX_DENSITY - density);
  }, []);

  const calculatedDensity = Math.max(1, MAX_DENSITY - particleRadius);
  const workerActions = useWorkerActions();

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
        min={MIN_DENSITY}
        max={MAX_DENSITY - 1}
        value={calculatedDensity}
        onChange={(e) => handleUpdateDensity(Number(e.target.value))}
      />
      <input
        type="number"
        value={calculatedDensity}
        onChange={(e) => handleUpdateDensity(Number(e.target.value))}
      />
    </div>
  </div>;
};
