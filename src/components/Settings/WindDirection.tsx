import {useCallback, useContext, useMemo} from 'react';
import {AppContext} from '../../contexts/AppContext';
import {useWorkerActions} from '../../hooks/useWorkerActions';
import {DEFAULT_WIND_DIRECTION} from '../../constants';
import {getSettingsConfig} from '../../settings-config';

export const WindDirection = () => {
  const appProps = useContext(AppContext);
  const windDirection = appProps?.windDirection ?? DEFAULT_WIND_DIRECTION;
  const workerActions = useWorkerActions();
  const {min: MIN_WIND_DIRECTION, max: MAX_WIND_DIRECTION, step: STEP} = useMemo(() => getSettingsConfig().windDirection, []);

  const handleUpdateWindDirection = useCallback(
    (windDirection: number) => {
      workerActions?.updateWindDirection(windDirection);
    },
    [workerActions]
  );

  if (!appProps) {
    return;
  }

  return (
    <div className="control-group">
      <label htmlFor="windDirection">Wind Direction:</label>
      <div className="slider-input-group">
        <input
          type="range"
          min={MIN_WIND_DIRECTION}
          max={MAX_WIND_DIRECTION}
          step={STEP}
          value={windDirection}
          onChange={(e) => handleUpdateWindDirection(Number(e.target.value))}
        />
        <input
          type="number"
          min={MIN_WIND_DIRECTION}
          max={MAX_WIND_DIRECTION}
          step={STEP}
          value={windDirection}
          onChange={(e) => handleUpdateWindDirection(Number(e.target.value))}
        />
      </div>
      <div className="wind-direction-indicator" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '8px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '2px solid #ccc',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '16px',
            height: '2px',
            backgroundColor: '#007acc',
            position: 'absolute',
            transformOrigin: 'center',
            transform: `rotate(${windDirection}deg)`,
            transition: 'transform 0.1s ease'
          }}>
            <div style={{
              position: 'absolute',
              right: '-4px',
              top: '-2px',
              width: '0',
              height: '0',
              borderLeft: '4px solid #007acc',
              borderTop: '3px solid transparent',
              borderBottom: '3px solid transparent'
            }} />
          </div>
        </div>
        <span style={{
          marginLeft: '8px',
          fontSize: '12px',
          color: '#666'
        }}>
          {windDirection}°
        </span>
      </div>
    </div>
  );
};
