import {useCallback, useContext} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';

export const ParticleOpacity = () => {
  const appProps = useContext(AppContext);
  const workerActions = useWorkerActions();

  const handleOpacityChange = useCallback((type: 'start' | 'end', value: number) => {
    if (type === 'start') {
      workerActions?.updateStartParticleOpacity(value);
    } else {
      workerActions?.updateEndParticleOpacity(value);
    }
  }, [workerActions]);

  if (!appProps) {
    return null;
  }

  return (
    <>
      <div className="control-group">
        <label htmlFor="startParticleOpacity">Start Particle Opacity (0-1):</label>
        <div className="slider-input-group">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={appProps.startParticleOpacity}
            onChange={(e) => handleOpacityChange('start', Number(e.target.value))}
          />
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={appProps.startParticleOpacity}
            onChange={(e) => handleOpacityChange('start', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="endParticleOpacity">End Particle Opacity (0-1):</label>
        <div className="slider-input-group">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={appProps.endParticleOpacity}
            onChange={(e) => handleOpacityChange('end', Number(e.target.value))}
          />
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={appProps.endParticleOpacity}
            onChange={(e) => handleOpacityChange('end', Number(e.target.value))}
          />
        </div>
      </div>
    </>
  );
};
