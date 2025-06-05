import {useCallback, useContext, useMemo} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';
import {DEFAULT_MIN_EFFECT_PARTICLES, DEFAULT_MAX_EFFECT_PARTICLES} from '../../constants';
import {getSettingsConfig} from '../../settings-config';

export const EffectParticleCount = () => {
  const appProps = useContext(AppContext);
  const minEffectParticles = appProps?.minEffectParticles ?? DEFAULT_MIN_EFFECT_PARTICLES;
  const maxEffectParticles = appProps?.maxEffectParticles ?? DEFAULT_MAX_EFFECT_PARTICLES;
  const workerActions = useWorkerActions();
  const {min: MIN_EFFECT_PARTICLES, max: MAX_EFFECT_PARTICLES, step: STEP} = useMemo(() => getSettingsConfig().minEffectParticles, []);

  const handleUpdateMinEffectParticles = useCallback(
    (value: number) => {
      const newMin = Math.min(value, maxEffectParticles);
      workerActions?.updateMinEffectParticles(newMin);
    },
    [workerActions, maxEffectParticles]
  );

  const handleUpdateMaxEffectParticles = useCallback(
    (value: number) => {
      const newMax = Math.max(value, minEffectParticles);
      workerActions?.updateMaxEffectParticles(newMax);
    },
    [workerActions, minEffectParticles]
  );

  if (!appProps) {
    return;
  }

  return (
    <div className="control-group">
      <label>Effect Particle Count Range:</label>
      <div className="range-control-group">
        <div className="range-input-group">
          <label htmlFor="minEffectParticles">Min:</label>
          <div className="slider-input-group">
            <input
              type="range"
              id="minEffectParticles"
              min={MIN_EFFECT_PARTICLES}
              max={MAX_EFFECT_PARTICLES}
              step={STEP}
              value={minEffectParticles}
              onChange={(e) => handleUpdateMinEffectParticles(Number(e.target.value))}
            />
            <input
              type="number"
              min={MIN_EFFECT_PARTICLES}
              max={MAX_EFFECT_PARTICLES}
              step={STEP}
              value={minEffectParticles}
              onChange={(e) => handleUpdateMinEffectParticles(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="range-input-group">
          <label htmlFor="maxEffectParticles">Max:</label>
          <div className="slider-input-group">
            <input
              type="range"
              id="maxEffectParticles"
              min={MIN_EFFECT_PARTICLES}
              max={MAX_EFFECT_PARTICLES}
              step={STEP}
              value={maxEffectParticles}
              onChange={(e) => handleUpdateMaxEffectParticles(Number(e.target.value))}
            />
            <input
              type="number"
              min={MIN_EFFECT_PARTICLES}
              max={MAX_EFFECT_PARTICLES}
              step={STEP}
              value={maxEffectParticles}
              onChange={(e) => handleUpdateMaxEffectParticles(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
