import {useCallback, useContext, useMemo} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';
import {DEFAULT_MAX_EFFECT_PARTICLE_LIFETIME} from '../../constants';
import {getSettingsConfig} from '../../settings-config';

export const MaxEffectParticleLifetime = () => {
  const appProps = useContext(AppContext);
  const maxEffectParticleLifetime = appProps?.maxEffectParticleLifetime ?? DEFAULT_MAX_EFFECT_PARTICLE_LIFETIME;
  const workerActions = useWorkerActions();
  const {min: MIN_MAX_EFFECT_PARTICLE_LIFETIME, max: MAX_MAX_EFFECT_PARTICLE_LIFETIME, step: STEP} = useMemo(() => getSettingsConfig().maxEffectParticleLifetime, []);

  const handleUpdateMaxEffectParticleLifetime = useCallback(
    (maxEffectParticleLifetime: number) => {
      workerActions?.updateMaxEffectParticleLifetime(maxEffectParticleLifetime);
    },
    [workerActions]
  );

  if (!appProps) {
    return;
  }

  return <div className="control-group">
    <label htmlFor="maxEffectParticleLifetime">Max Particle Lifetime (ms):</label>
    <div className="slider-input-group">
      <input
        type="range"
        min={MIN_MAX_EFFECT_PARTICLE_LIFETIME}
        max={MAX_MAX_EFFECT_PARTICLE_LIFETIME}
        step={STEP}
        value={maxEffectParticleLifetime}
        onChange={(e) => handleUpdateMaxEffectParticleLifetime(Number(e.target.value))}
      />
      <input
        type="number"
        min={MIN_MAX_EFFECT_PARTICLE_LIFETIME}
        max={MAX_MAX_EFFECT_PARTICLE_LIFETIME}
        step={STEP}
        value={maxEffectParticleLifetime}
        onChange={(e) => handleUpdateMaxEffectParticleLifetime(Number(e.target.value))}
      />
    </div>
  </div>;
};
