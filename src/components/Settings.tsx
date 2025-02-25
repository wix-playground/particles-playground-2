import {useCallback, useMemo, useRef, useContext} from 'react';
import {getPredefinedMovementOptions} from '../movement';
import {StartPosition} from './StartPosition';
import {Action} from '../interfaces';
import {AppContext} from '../contexts/AppContext';
import {WorkerContext} from '../contexts/WorkerContext';

export const Settings = () => {
  const worker = useContext(WorkerContext);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const appProps = useContext(AppContext);
  const handleResizeParticleRadius = useCallback(
    (radius: number) => {
      if (worker)
        worker.postMessage({
          type: Action.RESIZE_PARTICLE_RADIUS,
          data: {particleRadius: radius},
        });
    },
    [worker]
  );

  const predefinedMovementOptions = useMemo(
    () => getPredefinedMovementOptions(),
    []
  );

  const movementOptionKeys = useMemo(
    () => Object.keys(predefinedMovementOptions),
    [predefinedMovementOptions]
  );

  const handleFunctionSelect = useCallback(() => {
    if (worker)
      if (selectRef.current) {
        const option = selectRef.current.value;
        worker.postMessage({
          type: Action.UPDATE_SELECTED_MOVEMENT_FUNCTION,
          data: {
            key: option,
            movementFunctionCode: predefinedMovementOptions[option],
          },
        });
      }
  }, [predefinedMovementOptions, worker]);

  if (!appProps) {
    return;
  }

  return (
    <div className="layout card" style={{width: '30%'}}>
      <span className="cardTitle">Settings</span>
      <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
        Particle radius:
        <input
          className="userInput"
          style={{maxWidth: '60px'}}
          value={appProps.particleRadius}
          type="number"
          onChange={(e) => {
            const numberValue = Number(e.target.value);
            if (!Number.isNaN(numberValue) && numberValue > 0) {
              handleResizeParticleRadius(numberValue);
            }
          }}
        />
      </div>
      <StartPosition />
      <div className="card">
        <span className="innerTitle">Predefined movement functions</span>
        <select
          id="predefined-function-select"
          ref={selectRef}
          onChange={handleFunctionSelect}
          value={appProps.selectedMovementFunction}
          className="userInput"
        >
          {movementOptionKeys.map((option) => (
            <option id={option} value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
