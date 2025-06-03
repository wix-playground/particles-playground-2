import {useCallback, useContext} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';

export const ParticleSpreadSlider = () => {
  const workerActions = useWorkerActions();
  const appProps = useContext(AppContext);

  const handleParticleSpreadChange = useCallback(
    (value: number) => {
      workerActions?.updateParticleSpread(value);
    },
    [workerActions]
  );

  if (!appProps) return null;

  return (
    <div className="settings-item">
      <div className="settings-item-header">
        <span>Particle Spread</span>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px'}}>
        <input
          type="range"
          min="1"
          max="10"
          step="0.5"
          value={appProps.particleSpread}
          onChange={(e) => handleParticleSpreadChange(Number(e.target.value))}
          style={{flex: 1}}
        />
        <input
          type="number"
          min="1"
          max="10"
          step="0.5"
          value={appProps.particleSpread}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (!isNaN(value) && value >= 1 && value <= 10) {
              handleParticleSpreadChange(value);
            }
          }}
          style={{width: '60px'}}
          className="userInput"
        />
      </div>
    </div>
  );
};
